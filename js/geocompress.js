/**
 * @author sabareesh kkanan subramani
 * Contributions by BillSanders
 * Instantiates the object morc from drag and drop
 * compresses the image
 * finds geo location of image
 * If geo location is not found displays map which allows user to select a location from it.
 */
 
// creates the media object that has compressed image data url and geo co-ordinates. Called by dragdrop.js
// This is eventually POST'd in upload.php
function geocompress(file, type) {
	this.file = compress(file, type);
	this.loc = gpsverify(file);  // If gps coords not embedded, will start google map
	this.verify = function() {
		if (this.file.dataurl && this.loc.lat() && this.loc.lng()) {
			this.file.dataurl = this.file.dataurl.replace(/^data:image\/(png|jpg|jpeg);base64,/, "");  //KN: Removes anything unacceptable from the URL.  Google "Regex" for more info (mozilla's page is really good).
			return true;
		}
		else {
			return false;
		}
	}
}

// Compresses the image by first by resizing the image to smaller size
// and converting the resized image to jpeg dta url with quality of 0.8
function compress(file, type) {
	var x = new Object();
	var img = new Image();
	var reader = new FileReader(); //KN: A built-in class.
	reader.readAsDataURL(file); //KN: Treat file value as a url, and read from that url. 
	reader.onload = function(e) {  
		img.src = e.target.result;
		img.onload = function() {

			var canvas = document.createElement('canvas');
			var ctx = canvas.getContext("2d");
			ctx.drawImage(img, 0, 0);

			var MAX_WIDTH = 450;
			var MAX_HEIGHT = 280;
			var width = img.width;
			var height = img.height;
			//KN: Draw the image in a canvas, such it fits within the canvas boundaries. If it is too big, scale down both axes proportionally.
			if (width > height) {
				if (width > MAX_WIDTH) {
					height *= MAX_WIDTH / width;
					width = MAX_WIDTH;
				}
			}
			else {
				if (height > MAX_HEIGHT) {
					width *= MAX_HEIGHT / height;
					height = MAX_HEIGHT;
				}
			}
			canvas.width = width;
			canvas.height = height;
			var ctx = canvas.getContext("2d");
			ctx.drawImage(img, 0, 0, width, height);
			x.dataurl = canvas.toDataURL("image/jpeg", 0.8); //KN: Take the image drawn onto the canvas, and convert it to a jpg, with 80% quality.
			//dataurl=dataurl.replace(/^data:image\/(png|jpg|jpeg);base64,/, "");
		}
	}
	return x;
}

//KN: This function will check the geolocation in a picture, if they are within bounds, they will be accepted. If outside, or if not geolocated, then user will have to manually enter.
// If gps coords not embedded, will start google map UI for manual user GPS entry
function gpsverify(file) {
	var loc = new Object();
	var binary_reader = new FileReader();
	binary_reader.readAsBinaryString(file); //KN: Read the file as binary (every byte is an integer 0-255). QUESTION: why?

	binary_reader.onloadend = function(e) {
		var jpeg = new JpegMeta.JpegFile(e.target.result, file.name); //KN: Get the meta information from the jpg file.
		if (jpeg.gps && jpeg.gps.longitude) {
			var x = new google.maps.LatLng(jpeg.gps.latitude.value, jpeg.gps.longitude.value);
			if (huntboundary.contains(x)) { //KN: Check that the geolocation is within the boundaries. If so, save the location in latlng.
				loc.latlng = new google.maps.LatLng(jpeg.gps.latitude.value, jpeg.gps.longitude.value);
				loc.from = "Native";
			}
			else {
				alert("not inside the boundary");
			}
		}
		else {
			alert("The image you've selected is not geo tagged.\nPlease click on the location where you have taken the picture.\nOnce you have selected the right spot, please click 'Submit'");
			instantiateGoogleMap();
		}
	}
	return loc;
}

// KN: This function sets up the map so that a student can select their activity's location.
function instantiateGoogleMap() {
	var x = new Object(); //KN: QUESTION: x isn't even used anywhere. 
	
	var map = initializeMap(huntboundary.getCenter().lat(), huntboundary.getCenter().lng(), document.getElementById("main")); //KN: Sets up the map, with coordinates, zoom level, display style, etc. defined in MapFunctions.js. 

	map.fitBounds(huntboundary);  //KN: Sets the viewport to contain the boundaries of the hunt.

	// Creates the Rectangle overlay on the map.
	createRectangleOverlay(map, huntboundary); 
	
	var myMarker = new google.maps.Marker( //KN: Markers are the little pinpoints on the map, in this case representing Activities.
	{
		position: huntboundary.getCenter(),
		draggable: true,
		map: map
	});

	var gotoControl = createGotoControl(map, huntboundary.getCenter(), GoToControlOnSubmit, myMarker, false);  //KN: QUESTION: Why is this stored in a variable that isn't used anywhere else?

	google.maps.event.addListener(map, 'click', function(e) {
		alert("You can only select a location within the hunt area.\n")
	});

	google.maps.event.addListener(myMarker, 'drag', function(event) {
		if (document.getElementById('decimalDMSSelect').selectedIndex == 0) {
			updateLatLngBox(event.latLng);
		}
		else {
			updateLatLngDMS(event.latLng, false);
		}
	});
	
	// TODO could do bounds checking here?
	google.maps.event.addListener(myMarker, 'dragend', function(event) {
		var location = enforceBounds(huntboundary, event.latLng);
		placeMarker(myMarker, location);
// 		updateLatLng(location);
// 		updateLatLngDMS(location);
//		updateLatLngFollow(myFollowMarker, dropPrecision(event.latLng, bounds));
//		map.panTo(location);
	});
}

// KN: Goes back to the form view (from the map), displays activity information, and shows submitted image.
// TODO: Add code for clustering markers into the same latlng position
function submitLatLng(location) {
	if(morc){
		morc.loc = new google.maps.LatLng(location.lat(), location.lng());
		morc.from = "chosen";
	} else{
		sessionStorage.lat=location.lat();
		sessionStorage.lng=location.lng();
	}
	removeMap(); //KN: Go back to the form view.
	if(typeof(Storage)!=="undefined"){
		if(sessionStorage.isEdit=="true"){
			editActivityAsStudent(JSON.parse(sessionStorage.activity));
		} else{
			// TODO: Find a way to check if additional questions exist.
			document.getElementById("activity").innerHTML=multiple; //KN: Fill the activity div with the Activities' submission form.
			var activity=JSON.parse(sessionStorage.activity);
			var additionalAnswers={answera:activity.optionalAnswer1, answerb:activity.optionalAnswer2, answerc:activity.optionalAnswer3};
			document.getElementsByName("interesting_url")[0].innerHTML=activity.interesting_url;
			document.getElementsByName("partner_names")[0].innerHTML=activity.partner_names;
			// While the next function is going to have to parse the function, it provides more usability if this function is passed the JSON encoded string.
			// My reasoning for this is that when the additionalAnswers are taken from an activity, they will already be JSON encoded.
			// This should be the ONLY case where additionalAnswers aren't JSON encoded by default.
			displayAdditionalQuestions(JSON.stringify(additionalAnswers));
		}
	} else{
		// TODO: How to handle the user not submitting local storage?
	}
	
	//KN: The following will get the submitted image and displays it.
	var activityImageDiv = document.getElementById('activityImage').parentNode;
	activityImageDiv.innerHTML = "";
	var activityImage = document.createElement('img');
	activityImage.id = 'activityImage';
	if(morc){
		activityImage.src = morc.file.dataurl;
	} else if(sessionStorage.activity){
		activityImage.src= PHP_FOLDER_LOCATION + "image.php?id=" + JSON.parse(sessionStorage.activity).media_id;
	}
	activityImageDiv.appendChild(activityImage);
}

// KN: This function submits coordinates for activity. Called when the GoToControl Submit button is clicked, when teacher is selecting coordinates for a hunt.
function GoToControlOnSubmit() {
		// BUG: If you move the marker out of bounds and click submit, this function still submits
		// TODO: bounds checking?
		var latitude;
		var longitude;
		
		if (document.getElementById("decimalDMSSelect").selectedIndex == "1") {
			if (document.getElementById("latNSSelect").selectedIndex == 0) { latDirection = "N"; }
			else { latDirection = "S"; }
			if (document.getElementById("longNSSelect").selectedIndex == 0) { longDirection = "W"; }
			else { longDirection = "E"; }
			
			latitude = toDecimal(latDirection, document.getElementById("latDegrees").value, document.getElementById("latMinutes").value);
			longitude = toDecimal(longDirection, document.getElementById("longDegrees").value, document.getElementById("longMinutes").value);
		}
		else {
			latitude = document.getElementById("latitudeIn").value;
			longitude = document.getElementById("longitudeIn").value;
		}
		var location = new google.maps.LatLng(latitude, longitude);
		submitLatLng(location);
		document.getElementById("googlemap").style.height="0px";
	}

// currently unused.
function updateLatLngFollow(marker, location) {
//	newLocation = dropPrecision(location);
	document.getElementById('latitudeInFollow').value = location.lat().toFixed(5);
	document.getElementById('longitudeInFollow').value = location.lng().toFixed(5);
	marker.setPosition(location);
	marker.setVisible(true);
}


// KN: Moves map's view to designated coordinates, Called when the user clicks the "Take me there!" button
function placeMarker(marker, location) {
	updateLatLngBox(location,false);
	updateLatLngDMS(location);
	marker.setPosition(location);
	marker.getMap().panTo(location);
}


/* Currently unused, but will be rolled out soon.
 Bill Sanders 8/2012.
 We use this to reduce precision of LatLng's in order to 'clump' near locations together.
 The gist is: Take each coord.
 Multiply by 1000 and use Math.floor() to drop the decimals.
	Divide by 1000 to get it back to a coord.
	Add .0005 to "center"
 function reducePrecision(location) {
 	latitude = Math.floor(location.lat() * 1000) / 1000 + .0005;
 	longitude = Math.floor(location.lng() * 1000) / 1000 + .0005;
 	
 	newLoc = new google.maps.LatLng(latitude, longitude);
 	if (bounds.contains(newLoc)) {
 		return (newLoc);
 	}
 	// adjust latlng if coord falls out of bounds
 	else {
 		if (latitude < bounds.getSouthWest().lat())
 			latitude = bounds.getSouthWest().lat();
 		else if (latitude > bounds.getNorthEast().lat())
 			latitude = bounds.getNorthEast().lat();
 		if (longitude < bounds.getSouthWest().lng())
 			longitude = bounds.getSouthWest().lng();
 		else if (longitude < bounds.getNorthEast().lng())
 			longitude = bounds.getNorthEast().lng();
 
 		return(new google.maps.LatLng(latitude, longitude));
 	}
 }*/


// KN: This will bring any points from outside of the boundaries, to inside.
function enforceBounds(bounds, location) {
	if (bounds.contains(location)) {
		return (location)
	}
	else {
		var latitude = location.lat();
		var longitude = location.lng();

		if (latitude < bounds.getSouthWest().lat()) {
			latitude = bounds.getSouthWest().lat();
		}
		else if (latitude > bounds.getNorthEast().lat()) {
			latitude = bounds.getNorthEast().lat();
		}
		if (longitude < bounds.getSouthWest().lng()) {
			longitude = bounds.getSouthWest().lng();
		}
		else if (longitude > bounds.getNorthEast().lng()) {
			longitude = bounds.getNorthEast().lng();
		}
		return(new google.maps.LatLng(latitude, longitude));
	}
}
