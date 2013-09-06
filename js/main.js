/* KN: Used by public, student, and teacher.
Called by index.html

This file contains common scripts.
QUESTION: What do they mean by saying it handles ajax? Doesn't look like there's anything defining how to deal with ajax in here... That's actually in getConstants.js.
 */
/*
* Common scripts needed
* handles ajax
* handles selection of a hunt activity
* Creates activitiy array
* Wherever you see variable x it is a temporary varibale used for multiple operations
*/

//invoked by ajax function but loaded when the page is finished loading. THis receives the hunts from the server and it transfers it to javascript variable hunts
// Will also now store the hunts in sessionStorage.
// KN: Called when a teacher is logged in.
function createHuntList(x) {
	hunts = JSON.parse(x); // KN: hunts is declared in activity.js. 
	$('username').innerHTML = hunts[0];
	hunts = hunts[1]; //KN: QUESTION: Does this take one attribute from the hunts array, and turn hunts into just a normal variable with that as the contents?
	sessionStorage.hunts=JSON.stringify(hunts); //KN: Turns the hunts data into a JSON string, and puts that into session storage
	for ( x = 0; x < hunts.length; x++)
		$('selecthunt').options[$('selecthunt').options.length] = new Option(hunts[x]['title'], hunts[x]['id']); //KN: Add a new option to the dropdown menu for every hunt the teacher owns
}

//Creates some random number 
//KN: QUESTION: Is this still needed? The only place it is used is within Cyberhawk, and it's defined in there too.
var uniq = Math.floor((Math.random() * 100) + 1);

//shortcut to get object with their id
// KN: QUESTION: Isn't this just reinventing the wheel that jquery made? $('#myelement')
function $(x) {
	return document.getElementById(x);
}

//this function is invoked when a teacher selects a hunt
function huntsel() {
	$('activity').innerHTML = ''; //KN: Get rid of whatever was previously on screen
	$('students').innerHTML = ''; //KN: Remove the students
	ajax("what=activities&id=" + document.getElementById("selecthunt").value, GLOBALS.PHP_FOLDER_LOCATION + 'getHunts.php', create_activity_obj); //KN: The hunt selected goes to getHunts.php, and afterwards, create_activity_obj (in activity.js) is called, which makes an array of all activities associated with that hunt.
	createTeacherMap();  //KN: Draws activities onto the map. Defined in createActivityMap.js
	
	if(document.getElementById("mapButton")==null){ //KN: QUESTION: I don't have teacher access. This makes a button to show a list of student activities?
		var button=document.createElement("button"); //KN: QUESTION: Why do this rather than just having a button built in?
		button.setAttribute("value", "List View");
		button.setAttribute("id", "mapButton");
		button.setAttribute("class", "cyberButton");
		button.innerHTML="List View";
		button.onclick=mapListButton;
		document.getElementById("contentSection").insertBefore(button, document.getElementById("newhunt"));
	}
	
	if(document.getElementById("editHunt")==null){	//KN: In the same nature as the button above, make a button for editing a hunt that was already made.
		var button=document.createElement("button");
		button.setAttribute("value", "View Hunt Info");
		button.setAttribute("id", "editHunt");
		button.setAttribute("class", "cyberButton");
		button.onclick=viewHuntInformation;
		button.innerHTML="View Hunt Info";
		document.getElementById("contentSection").insertBefore(button, document.getElementById("newhunt"));
	}
	
}

//creates a dom element
function createElement(x, y) {
	x = document.createElement(x);
	x.innerHTML = y;
	return x;
}

//Pretty sure we could refactor these two prototype functions out and just use array's .indexOf() which returns -1

// a custom prototype thats been added to array object to find existence of particular value 
//KN: Doesn't show where it is, just that it exists.
Array.prototype.has = function(v) {
	for ( i = 0; i < this.length; i++) {
		if (this[i] == v)
			return true;
	}
	return false;
}
//A custom prototype verifies whether paticular id exist inside the array
Array.prototype.hassid = function(v) {
	for ( i = 0; i < this.length; i++) {
		if (this[i].sid == v)
			return i;
	}
	return "false";
}
