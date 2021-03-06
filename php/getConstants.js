// Grabs the constants.json file, and parses it into a const global variable to be used by the rest of the js files.
// Is called from the header.html file, so it should be included on every page.

//ajax POST request
function ajax(data, url, callback) {
	var xmlhttp;
	console.log("Sending ajax request to " + url);
	
	if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
		xmlhttp = new XMLHttpRequest();
	}
	else {// code for IE6, IE5
		xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	}
	
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			if (xmlhttp.responseText == 'sessionfail')
				window.location = '../';
			callback(xmlhttp.responseText);
		}
	}
	if (data=="GET")
	{
		xmlhttp.open("GET",url,true);
		xmlhttp.send();
	}
	else {
		xmlhttp.open("POST", url, true);
		xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xmlhttp.send(data);
	}
}

ajax("GET", "http://ouyangdevvm.cs.csusm.edu/cyberscavenger/constants.json", createGlobalConstant);
var GLOBALS;

function createGlobalConstant(serverResponse){
:i
:x
	GLOBALS=JSON.parse(serverResponse);
	ajax("GET", GLOBALS.HTML_FOLDER_LOCATION + "activityView.html", function(serverResponse){GLOBALS.activityView=serverResponse;});
	ajax("GET", GLOBALS.HTML_FOLDER_LOCATION + "huntInformation.html", function(serverResponse){GLOBALS.huntInformation=serverResponse;});
	ajax("GET", GLOBALS.HTML_FOLDER_LOCATION + "publicActivityView.html", function(serverResponse){GLOBALS.publicActivityView=serverResponse;});
	ajax("GET", GLOBALS.HTML_FOLDER_LOCATION + "createHunt.html", function(serverResponse){GLOBALS.createHunt=serverResponse;});
}
