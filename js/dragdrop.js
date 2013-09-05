///image valid
/*
 * This file handles all the drag and drop functionality.
 * Creates a global varialble morc which stores the image information such as dataurl,geolocation
 
 
  */
 //checks validity of image
 //KN: Checks the file extension to make sure it is a standard image type. Else, the file is not accepted
function validimg(url) {

	if (!checkURL(url)) {
		alert("It looks like the url that you had provided is not valid! Please only submit correct image file. We only support these extensions:- jpeg, jpg, gif, png.\n The url provided was \n" + url);
		return (false);
	} else
		return true;

	// can't submit the form yet, it will get sumbitted in the callback
}
//supported formats
//KN: QUESTION: Since this is just a single line, and exclusivley called by validimg, why make it a separate function?
function checkURL(url) {
	return (url.match(/\.(jpeg|jpg|gif|png)$/) != null);
}
//initialises the file api
function starter() {
	// call initialization file
	if (window.File && window.FileReader && window.FileList && window.Blob) { //KN: File provides information on a file (name, size), FileReader makes it possible to read Files or Blobs and gets the results from those readings, FileList allows dragging directories, Blob separates files into byte ranges
		// Great success! All the File APIs are supported.
		Init();

	} else {
		alert('The File APIs are not fully supported in this browser.');
	}

}

// initialize
function Init() {

	var xhr = new XMLHttpRequest(); //KN: These objects obtain data from the URL without having to refresh the page. Part of a page can be updated without interrupting everything else.
	if (xhr.upload) { //KN: QUESTION: I can't figure out what this should do. I can't find anything clear regarding the .upload attribute.

		c_h5 = true;
		//html5 supported
	} else
		alert("please update your browser");

}

// output information //KN: Used for Cyberhawk integration.
function Output(msg, dest) { 
	dest.innerHTML = msg;
}

// file drag hover //KN: Used in createActivity.html, called when something is dragged over the drag area.
function FileDragHover(e) {
	e.stopPropagation(); 		//KN: Prevents the event from triggering again
	e.preventDefault();			//KN: The default response for the event will no longer happen (e.g. clicking a link with preventDefault() won't navigate to the page)
	e.target.className = (e.type == "dragover" ? "filedrag hover" : "filedrag"); //KN: Change the class of the target. I believe this is just for the stylesheet, nothing else. (see .filedrag.hover in style.css)
}

// file selection handler
// FileSelectHandler is called from "/quest/user/htm/multiple.htm" on a drag and drop event, or the onchange event of the image input on that page

// note: morc is a global variable
// 'morc' is eventually set as contents['media'] in user/js/wscript.js
// which is then sent in a POST to upload.php as 'media' after being JSON.stringify'd
var morc; // image object with compressed image with geo location

function FileSelectHandler(e) {
	var activity=new Object();
	form=document.getElementById("activity").childNodes[3];
	for (var i=0; i<form.length; i++) {
			activity[form[i].name] = form[i].value;
	}
	sessionStorage.activity=JSON.stringify(activity);
	FileDragHover(e);
	var files = e.target.files || e.dataTransfer.files;
	if (files.length >= 1) {
		var obj = new geocompress(files[0], "file");
		morc = obj;

	}
	else {
		if (validimg(e.dataTransfer.getData("text/uri-list"))) {
			if (c_alldata.length < media.count) {
				geocompress(e.dataTransfer.getData("text/uri-list"), "iurl");
			}
			else {
				alert("Media content is Full delete some to add new ");
			}
		}
		else {
			// what happens here?
		}
	}

}
