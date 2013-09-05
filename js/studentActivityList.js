/*KN: Used by student.
Included in user.html

The functions in this file are unused as far as I can tell so I'm not going through this very thoroughly for now.
Supposed to used for getting a list of all of the activities a student has submitted.
*/

// studentActivityList.js is used in order to query the server
// and then display the list of activities that the student has already
// submitted.  It is also at this screen where the student can select to create a new Activity.

// This function is to be called whenever you want the activity div to list all of the
// students activities.
// If I find nothing else that I want to do before I call the php function, then I will move this into the html file.
// Currently called by:  Nothing.
/* KN: Function is called when the student clicks the dropdown list to select from hunts.*/
function createStudentActivityList(){
	ajax('hunt=' + document.getElementById("selecthunt").value + // POSTS the huntid.
		"&id=" + document.getElementById("username").innerHTML,    // Posts student firstname
		GLOBALS.PHP_FOLDER_LOCATION + "getStudentActivities.php", studentActivityList);  // Gives filename to post to and callback function.
}


//KN: activity is the div for the main portion of the page. This takes a server response and fills activity with it. (This doesn't seem to be used by anything at all)
//KN: QUESTION: Why does this do that? Was this for early troubleshooting?
function displayPage(serverResponse){
	var activityDiv=document.getElementById("activity");
	activityDiv.innerHTML=serverResponse;
}

// This function is the callback function from createStudentActivityList()
// It's purpose is to parse the json, and then display it to the user.
function studentActivityList(serverResponse){
	activitiesDiv = document.getElementById('activity'); //KN: Target the activity div (The main section of the page, most of the white area)
	activitiesDiv.innerHTML = ""; 						//KN: Clear the contents of it
	var activities=JSON.parse(serverResponse);			//KN: Parse all of the contents from the server response (the activities for a student), and put them into an array
	if(document.getElementById("newActivity")==null){	//KN: newActivity is the button for students to add a new activity. If it doesn't exist yet, then create it. 
		var button=document.createElement("button");	//KN: QUESTION: Why do that? Why not just have the button built in to somewhere like user.html?
		button.setAttribute("class", "cyberButton");
		button.setAttribute("value", "New Activity");
		button.setAttribute("id", "newActivity");
		button.onclick=huntselection;					//KN: When clicked, call huntselection (in wscript.js)
		button.innerHTML="New Activity";
		document.getElementById("main").insertBefore(button, document.getElementById("contents")); //KN: nserts the button before the contents div (which is inside of activity, but below the header area)
	}
	if(document.getElementById("Cyberhawk")==null){		//KN: Create a Cyberhawk View button as needed, in the same fashion as for the New Activity button above
		var button=document.createElement("button");
		button.setAttribute("class", "cyberButton");
		button.setAttribute("value", "Cyberhawk View");
		button.setAttribute("id", "Cyberhawk");
		button.onclick=function(){
			var win=window.open("/cyberhawk/quest/CyberhawkIntegration/main.php?q="+document.getElementById("selecthunt").value, "_blank");
			win.focus();
			return false;
		}
		button.innerHTML="Cyberhawk View";
		document.getElementById("main").insertBefore(button, document.getElementById("contents"));
	}
	for(var i = 0; i < activities.length; i++){	//KN: Take the array from earlier (made from parsing JSON strings from the server)
		activitiesDiv.appendChild(generateActivityView(activities[i], true, i)); //KN: Send the elements to generateActivityView (in activity.js) and then add them to the page.
	}
}
