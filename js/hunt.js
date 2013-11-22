/* KN: Used by public, student, and teacher
Included in index.html, teacher.html, and user.html
Depends on mapFunctions.js

This file has functions to handle creation of new hunts, viewing them, and finding them in sessionStorage.
*/


//KN: This function starts the hunt creation process. Checks if it can get geolocation from the device, and continues onto the next appropriate function. Called when New Hunt button is clicked.
function createhunt() {
	document.getElementById("selecthunt").value=0;	//KN: Finds that dropdown menu for choosing an existing hunt, and clears the value from it.
	if(document.getElementById("slist")) document.getElementById("slist").style.display="none"; //KN: slist houses all of the students for the logged-in teacher. It is created by listbox in activity.js
  if (navigator.geolocation){ //KN: If the browser has permission to get geolocation, then use it.
    navigator.geolocation.getCurrentPosition(receivedLocation, noLocation); //KN: If success, then it will callback receivedLocation. If failure, then it will callback noLocation.
	}
	else {
		noLocation(); //KN: And if the browser can't get geolocation, then call noLocation
	}
}

//KN: This function puts current coordinates into the next function call. Called by createHunt if it the browser has access to the computer's location.
function receivedLocation(position){
	newHuntMap(initializeMap(position.coords.latitude, position.coords.longitude));
}
//KN: Puts default coordinates (CSUSM Campus) into the next function call. Called by createHunt if it can't get the computer's location.
function noLocation(){
	newHuntMap(initializeMap(GLOBALS.DEFAULT_LAT, GLOBALS.DEFAULT_LNG)); 
}


// Creates a new map, and sets location and boundaries.  The box can also have its edges dragged to move it.
//KN: Called by either noLocation or receivedLocation. 
function newHuntMap(map){
	// Creates the rectangle at the center of the map, and is the default size (according to the default variable).
	//KN: Uses the bottom left and top right corners of the rectangles. In either case, it finds the center of the map, and subtracts half to go left/up, or adds half to go right/down, and those will be the corners of the map.
	var southwest=new google.maps.LatLng(map.getCenter().lat()-GLOBALS.DEFAULT_RECT_SIZE/2, map.getCenter().lng()-GLOBALS.DEFAULT_RECT_SIZE/2); 
	var northeast=new google.maps.LatLng(map.getCenter().lat()+GLOBALS.DEFAULT_RECT_SIZE/2, map.getCenter().lng()+GLOBALS.DEFAULT_RECT_SIZE/2);
	var bounds=new google.maps.LatLngBounds(southwest, northeast); //KN: LatLngBounds actually creates a rectangle with the coordinates
	rectangle=createRectangleOverlay(map, bounds); //KN: Gives the rectangle a different appearance. Defined in mapFunctions.js
	rectangle.setEditable(true); 
	createGotoControl(map, rectangle.getBounds().getCenter(), function(){}, rectangle, true) //KN: fills an html div with the contents of the map latlng control. Defined in mapFunctions.js
	google.maps.event.addListener(rectangle, "bounds_changed", function(event){ 
		updateWidthHeight(rectangle.getBounds());
	});
}

// Fills huntInformation.html
//KN: QUESTION: Doesn't look like anything calls this function. Was this maybe replaced by viewHuntInformation? That seems to do the same things and more.
function fillHuntInformation(){
	var hunt=JSON.parse(sessionStorage.hunts)[getHuntSelectNumber(document.getElementById("selecthunt").value)]; //KN: Take the hunt ID, find its location in sessionStorage, and parse that hunt into a variable.
	ajax("id=" + document.getElementById("selecthunt").value, GLOBALS.PHP_FOLDER_LOCATION + "getStudentForHunt.php", function(serverResponse){ //KN: Get the list of students for the selected hunt and fill the divs with student usernames and passwords.
		if(serverResponse=="false"){ //KN: 
			document.getElementById("student_username_label").innerHTML="";
			document.getElementById("student_password_label").innerHTML="";
		}else{ 
			var student=JSON.parse(serverResponse);
			document.getElementById("student_username").innerHTML=student.username;
			document.getElementById("student_password").innerHTML=student.password;
		}
	});
	
	document.getElementById("title").innerHTML=hunt.title; 
	document.getElementById("dueDate").innerHTML=hunt.dueDate;
}

// KN: Shows information about a selected hunt (title, map, questions). Called by the Hunt Info button from the teacher view.
function viewHuntInformation(){
	document.getElementById("students").style.display="none"; 
	document.getElementById("activity").innerHTML=GLOBALS.createHunt; //KN: Fill activity with contents from createHunt.html
	document.getElementById("activity").style.display="none"; 
	document.getElementById("activity").style.display="block";
	var hunt=JSON.parse(sessionStorage.hunts)[getHuntSelectNumber(document.getElementById("selecthunt").value)]; //KN: Get the selected hunt's info (Get the id from the select menu, then getHuntSelectNumber finds the location of that value in sessionStorage. Then that location is the array element for sessionStorage.hunts)
	document.getElementById("title").value=hunt.title;	
	document.getElementById("dateOfTrip").value=hunt.dateofTrip;
	var additionalQuestions=JSON.parse(hunt.additionalQuestions); 
	if(additionalQuestions.questiona) document.getElementById("additionalQuestion1").value=additionalQuestions.questiona;
	if(additionalQuestions.questionb) document.getElementById("additionalQuestion2").value=additionalQuestions.questionb;
	if(additionalQuestions.questionc) document.getElementById("additionalQuestion3").value=additionalQuestions.questionc;
	document.getElementById("editLatLngButton").style.display="none"; 
	document.getElementById("submit").style.display="none";
	document.getElementById("editHunt").value="Map View";	
	document.getElementById("editHunt").onclick=function(){ //KN: When the button is clicked, it will get a hunt and get the hunt information.
		huntsel(document.getElementById("selecthunt").value); //KN: QUESTION: huntsel() doesn't accept any parameters. Should this be huntselection?
		document.getElementById("editHunt").onclick=viewHuntInformation; 
		document.getElementById("editHunt").value="View Hunt Info"; 
	}
	displayHuntBounds(); 
}

// KN: This function finds a given hunt ID in storage, and returns its position.
function getHuntSelectNumber(id){
	
	// If the selecthunt option exists, then the only hunts in sessionStorage.hunts are the one that the student or teacher is a part of.
	if(document.getElementById("selecthunt"))	
		for(var i=0; i<document.getElementById("selecthunt").options.length; i++){ 
			if(document.getElementById("selecthunt").options[i].value==id) return i-1; //KN: Return the index in which the hunt is stored.
		}
	
	// Otherwise, the selecthunt doesn't exist (using publicView) and we must loop through all of the hunts in sessionStorage.
	var hunts=JSON.parse(sessionStorage.hunts);
	for(var i=0; i<hunts.length; i++){
		if(hunts[i].id==id) return i;
	}
}