/* KN: Used by public, student, and teacher
Included in index.html, teacher.html, and user.html

*/
// The purpose of this file is for the creation of the new hunts.
// When the New Hunt button is clicked, the createHunt function is called.

// Dependencies:  mapFunctions.js

// Is called when the New Hunt button is clicked.
// Checks if the browser can find out users location, if so, use that for the coords to load the google map.
// Otherwise, we center it at the default coords.
function createhunt() {
	document.getElementById("selecthunt").value=0;	//KN: Finds that dropdown menu for choosing an existing hunt, and clears the value from it.
	if(document.getElementById("slist")) document.getElementById("slist").style.display="none"; //KN: slist houses all of the students for the logged-in teacher. style.display="none" will hide it. It is created by listbox in activity.js
  if (navigator.geolocation){ //KN: If the browser has permission to get geolocation, then use it.
    navigator.geolocation.getCurrentPosition(receivedLocation, noLocation); //KN: If success, then it will callback receivedLocation. If failure, then it will callback noLocation.
	}
	else {
		noLocation(); //KN: And if the browser can't get geolocation, then directly call noLocation
	}
}

//KN: Called by createHunt if it the browser has access to the computer's location.
function receivedLocation(position){
	newHuntMap(initializeMap(position.coords.latitude, position.coords.longitude)); //KN: Set the map location to the user's current location.
}
//KN: Called by createHunt otherwise.
function noLocation(){
	newHuntMap(initializeMap(GLOBALS.DEFAULT_LAT, GLOBALS.DEFAULT_LNG)); //KN: Set the map location to the default coordinates (at the CSUSM campus)
}


// Creates a new map, and creates a GoToControlBox for it.  The box can also have it's edges dragged to move it.
//KN: Called by either noLocation or receivedLocation
function newHuntMap(map){
	// Creates the rectangle at the center of the map, and is the default size (according to the default variable).
	//KN: Uses the bottom left and top right corners of the rectangles. In either case, it finds the center of the map, and subtracts half to go left/up, or adds half to go right/down, and those will be the corners of the map.
	var southwest=new google.maps.LatLng(map.getCenter().lat()-GLOBALS.DEFAULT_RECT_SIZE/2, map.getCenter().lng()-GLOBALS.DEFAULT_RECT_SIZE/2); 
	var northeast=new google.maps.LatLng(map.getCenter().lat()+GLOBALS.DEFAULT_RECT_SIZE/2, map.getCenter().lng()+GLOBALS.DEFAULT_RECT_SIZE/2);
	var bounds=new google.maps.LatLngBounds(southwest, northeast); //KN: LatLngBounds actually creates a rectangle with the coordinates
	rectangle=createRectangleOverlay(map, bounds); //KN: Gives the rectangle a different appearance. Defined in mapFunctions.js
	rectangle.setEditable(true); 
	createGotoControl(map, rectangle.getBounds().getCenter(), function(){}, rectangle, true)	//KN: "fills an html div with the contents of the map latlng control". Defined in mapFunctions.js
	google.maps.event.addListener(rectangle, "bounds_changed", function(event){ 
		updateWidthHeight(rectangle.getBounds());
	});
}

// Fills huntInformation.html
//KN: QUESTION: Doesn't look like anything calls this function. Was this maybe replaced by viewHuntInformation? That seems to do the same things and more.
function fillHuntInformation(){
	var hunt=JSON.parse(sessionStorage.hunts)[getHuntSelectNumber(document.getElementById("selecthunt").value)]; //KN: Parse the stored hunts (got stored in createHuntList) as an assoc array. Take the element of the selected hunt's ID. Put that in "hunt"
	ajax("id=" + document.getElementById("selecthunt").value, GLOBALS.PHP_FOLDER_LOCATION + "getStudentForHunt.php", function(serverResponse){ //KN: Get the list of students for the selected hunt and...
		if(serverResponse=="false"){ //KN: If there aren't any students, then make the div blank
			document.getElementById("student_username_label").innerHTML="";
			document.getElementById("student_password_label").innerHTML="";
		}else{ // KN: If there are students, then populate the username/password field
			var student=JSON.parse(serverResponse);
			document.getElementById("student_username").innerHTML=student.username;
			document.getElementById("student_password").innerHTML=student.password;
		}
	});
	//KN: And modify the name and date to the specified hunt's.
	document.getElementById("title").innerHTML=hunt.title; 
	document.getElementById("dueDate").innerHTML=hunt.dueDate;
}

// Is called by the Hunt Info button from the teacher view.
//KN: Shows the information about a specific hunt -- it's title, the boundaries, the questions for students.
function viewHuntInformation(){
	document.getElementById("students").style.display="none"; //KN: Hide the students
	document.getElementById("activity").innerHTML=GLOBALS.createHunt; //KN: Fill activity with contents from createHunt.html
	document.getElementById("activity").style.display="none"; //KN: Hide the activity
	document.getElementById("activity").style.display="block";
	var hunt=JSON.parse(sessionStorage.hunts)[getHuntSelectNumber(document.getElementById("selecthunt").value)]; //KN: Parse the stored hunts (got stored in createHuntList) as an assoc array. Take the element of the selected hunt's ID. Put that in "hunt"
	document.getElementById("title").value=hunt.title;	
	document.getElementById("dateOfTrip").value=hunt.dateofTrip;
	var additionalQuestions=JSON.parse(hunt.additionalQuestions); 
	if(additionalQuestions.questiona) document.getElementById("additionalQuestion1").value=additionalQuestions.questiona;
	if(additionalQuestions.questionb) document.getElementById("additionalQuestion2").value=additionalQuestions.questionb;
	if(additionalQuestions.questionc) document.getElementById("additionalQuestion3").value=additionalQuestions.questionc;
	document.getElementById("editLatLngButton").style.display="none"; //KN: hide the button for editing coordinates
	document.getElementById("submit").style.display="none";	//KN: Hide the submit button
	document.getElementById("editHunt").value="Map View";	
	document.getElementById("editHunt").onclick=function(){ //KN: When the "Map View" button is clicked, 
		huntsel(document.getElementById("selecthunt").value); //KN: QUESTION: huntsel() doesn't accept any parameters. Should this be huntselection?
		document.getElementById("editHunt").onclick=viewHuntInformation; //KN: ...then call this function again
		document.getElementById("editHunt").value="View Hunt Info"; //KN: And change the button name back. 
	}
	displayHuntBounds(); //KN: And show the boundaries of the hunt. 
}

// Returns which option from the select is the selected hunt.
function getHuntSelectNumber(id){
	// If the selecthunt option exists, then the only hunts in sessionStorage.hunts are the one that the student or teacher is a part of.
	//KN: Go through the select's options, and if an option has the same id as the desired one, return its location
	if(document.getElementById("selecthunt"))	
		for(var i=0; i<document.getElementById("selecthunt").options.length; i++){ 
			if(document.getElementById("selecthunt").options[i].value==id) return i-1; //KN: This return is because option 0 is really just the word "Select", so option 1 is the first real hunt. This will return that first real hunt instead as 0.
		}
	// Otherwise, the selecthunt doesn't exist (using publicView) and we must loop through all of the hunts in sessionStorage.
	var hunts=JSON.parse(sessionStorage.hunts);
	for(var i=0; i<hunts.length; i++){
		if(hunts[i].id==id) return i;
	}
}