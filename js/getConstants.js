/* KN: Used by public, student, and teacher.
Called by header.html

This file is used to convert the constants.json file (which holds the default longitude/latitude, rectangle size (QUESTION: This is for the size of the map itself?), and location of the PHP and HTML folders) into a global variable.
QUESTION: Why not just have it as a global variable to begin with?
 */

// Grabs the constants.json file, and parses it into a const global variable to be used by the rest of the js files.
// Is called from the header.html file, so it should be included on every page.

//ajax POST request
function ajax(data, url, callback) {
	var xmlhttp;
	
	//KN: XMLHttpRequests are used to get data from the URL without having to refresh the page.
	if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
		xmlhttp = new XMLHttpRequest();
	}
	else {// code for IE6, IE5
		xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	}
	
	xmlhttp.onreadystatechange = function() { 		//KN: This will check for EVERY time the readystate changes, but ignore until it's 4 below.
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) { //KN: readystate == 4 means that the operation is done. And a HTTP result code of 200 means a successful request
			if (xmlhttp.responseText == 'sessionfail') 			// KN: QUESTION: is 'sessionfail' a standard, built-in response? And does this mean it couldn't find the file?
			window.location = '../'; 			//KN: QUESTION: Does this mean that if some operation failed to happen, the page will go back to the main directory? (i.e. back to index.html with the public view)
			callback(xmlhttp.responseText); 		//KN: Perform the callback function, with that response text as the parameter
		}
	}
	
	//KN: GET is used only to view something (like search results). POST allows to change it (like changing your password in a database). 
	if (data=="GET") 
	{
		xmlhttp.open("GET",url,true); //KN: "true" means it will be an asynchronous request.
		xmlhttp.send();
	}
	else {
		xmlhttp.open("POST", url, true);
		xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xmlhttp.send(data);
	}
}

ajax("GET", "http://ouyangdev.cs.csusm.edu/cyberhawk/quest/constants.json", createGlobalConstant);
var GLOBALS;

function createGlobalConstant(serverResponse){
	GLOBALS=JSON.parse(serverResponse);
	ajax("GET", GLOBALS.HTML_FOLDER_LOCATION + "activityView.html", function(serverResponse){GLOBALS.activityView=serverResponse;});
	ajax("GET", GLOBALS.HTML_FOLDER_LOCATION + "huntInformation.html", function(serverResponse){GLOBALS.huntInformation=serverResponse;});
	ajax("GET", GLOBALS.HTML_FOLDER_LOCATION + "publicActivityView.html", function(serverResponse){GLOBALS.publicActivityView=serverResponse;});
	ajax("GET", GLOBALS.HTML_FOLDER_LOCATION + "createHunt.html", function(serverResponse){GLOBALS.createHunt=serverResponse;});
}