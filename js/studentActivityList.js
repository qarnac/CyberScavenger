// studentActivityList.js is used in order to query the server
// and then display the list of activities that the student has already
// submitted.  It is also at this screen where the student can select to create a new Activity.

// This function is to be called whenever you want the activity div to list all of the
// students activities.
// If I find nothing else that I want to do before I call the php function, then I will move this into the html file.
// Currently called by:  Nothing.
function createStudentActivityList(){
	ajax('hunt=' + document.getElementById("selecthunt").value + // POSTS the huntid.
		"&id=" + document.getElementById("username").innerHTML,    // Posts student firstname
		GLOBALS.PHP_FOLDER_LOCATION + "getStudentActivities.php", studentActivityList);  // Gives filename to post to and callback function.
}


function displayPage(serverResponse){
	var activityDiv=document.getElementById("activity");
	activityDiv.innerHTML=serverResponse;
}

// This function is the callback function from createStudentActivityList()
// It's purpose is to parse the json, and then display it to the user.
function studentActivityList(serverResponse){
	activitiesDiv = document.getElementById('activity');
	activitiesDiv.innerHTML = "";
	var activities=JSON.parse(serverResponse);
	if(document.getElementById("newActivity")==null){
		var button=document.createElement("button");
		button.setAttribute("class", "cyberButton");
		button.setAttribute("value", "New Activity");
		button.setAttribute("id", "newActivity");
		button.onclick=huntselection;
		button.innerHTML="New Activity";
		document.getElementById("main").insertBefore(button, document.getElementById("contents"));
	}
	if(document.getElementById("Cyberhawk")==null){
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
	for(var i = 0; i < activities.length; i++){
		activitiesDiv.appendChild(generateActivityView(activities[i], true, i));
	}
}
