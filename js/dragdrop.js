///image valid 

/* KN: Used by students.
Called by user.html

The triple-slash line above means that it is a line of xml code.
This file handles uploading of files, particularly the drag-and-drop functionality.
 */
 
/*
This file handles all the drag and drop functionality.
Creates a global varialble morc which stores the image information such as dataurl,geolocation
  */
 //checks validity of image
 //KN: This function checks if the image URL is valid.
function validimg(url) {

	if (!checkURL(url)) {
		alert("It looks like the url that you had provided is not valid! Please only submit correct image file. We only support these extensions:- jpeg, jpg, gif, png.\n The url provided was \n" + url);
		return (false);
	} else
		return true;

	// can't submit the form yet, it will get sumbitted in the callback
}

//KN: This function scans the URL for unacceptable characters.
//KN: QUESTION: Since this is just a single line, and exclusively called by validimg, why make it a separate function?
function checkURL(url) {
	return (url.match(/\.(jpeg|jpg|gif|png)$/) != null); //KN: Google "regex" for more information on this (mozilla's page is really good)
}

//This function initialises the file api
//KN: File provides information on a file (name, size), FileReader makes it possible to read Files or Blobs and gets the results from those readings, FileList allows dragging directories, Blob separates files into byte ranges
function starter() {
	// call initialization file
	if (window.File && window.FileReader && window.FileList && window.Blob) { 
		// Great success! All the File APIs are supported.
		Init();

	} else {
		alert('The File APIs are not fully supported in this browser.');
	}
}

// initialize
//KN: This function makes sure that html5 is supported by the browser.
function Init() {

	var xhr = new XMLHttpRequest(); //KN: These objects obtain data from the URL without having to refresh the page. Part of a page can be updated without interrupting everything else.
	if (xhr.upload) { //KN: Makes sure that this browser can upload data the HTML5 way.

		c_h5 = true;
		//html5 supported
	} else
		alert("please update your browser");

}

// output information 
//KN: Fills an html element with a message. Exclusively used for Cyberhawk integration.
function Output(msg, dest) { 
	dest.innerHTML = msg;
}

// file drag hover 
//KN: Handles users dragging files over the specified area. Used in createActivity.html.
function FileDragHover(e) {
	e.stopPropagation(); 		//KN: Prevents the event from triggering again
	e.preventDefault();			//KN: The default response for the event will no longer happen (e.g. clicking a link with preventDefault() won't navigate to the page)
	e.target.className = (e.type == "dragover" ? "filedrag hover" : "filedrag"); //KN: Makes the drag area change colors to respond to something being dragged over it, by changing class. See style.css
}

//  morc is a global variable
// morc is eventually set as contents['media'] in user/js/wscript.js
// which is then sent in a POST to upload.php as 'media' after being JSON.stringify'd
var morc; // KN: Holds an image and geo tag data for it.

// FileSelectHandler is called from "/quest/user/htm/multiple.htm" on a drag and drop event, or the onchange event of the image input on that page 
// KN:  Takes in an image, validates it, and geocompresses it. Called after student clicks "Choose File" for the image, in createActivity.html. 
function FileSelectHandler(e) {
	var activity=new Object();
	form=document.getElementById("activity").childNodes[3]; //KN: Gets the form named "multiple", which contains all of the questions. QUESTION: Why not just getElementByID("multiple")?
	for (var i=0; i<form.length; i++) {
			activity[form[i].name] = form[i].value; 
	}
	sessionStorage.activity=JSON.stringify(activity); 
	FileDragHover(e); 
	var files = e.target.files || e.dataTransfer.files; // KN: target means user selected the file from the explorer, dataTransfer means user did drag and drop. Whichever they did, take that file and put it into the variable "files".
	if (files.length >= 1) {
		var obj = new geocompress(files[0], "file");  //KN: Compresses the image, and gets the geo-tag data from it if possible (if not, asks user to manually set location).
		morc = obj; //KN: Store that in the global, morc.

	}
	// KN: Ignore this section for now. It is intended for cases where the students drag images from websites (Not pasting URLs, but actually dragging the image over). Not implemented.
	else { 
		if (validimg(e.dataTransfer.getData("text/uri-list"))) {  //KN: Get the URI from the dragged web image (check wikipedia article URI if confused).
			if (c_alldata.length < media.count) { // KN: media.count stems from the plan to have multiple media in cyberhawk. 
				geocompress(e.dataTransfer.getData("text/uri-list"), "iurl"); //KN: Compress and geotag the destination of the URI
			}
			else { 
				alert("Media content is Full delete some to add new ");
			}
		}
		else {
			// what happens here?
		}
	} //KN: End ignored section.
}