// This file is going to be respsonsible for holding all of the map functions that are used multiple places.



function $(x){return document.getElementById(x);}

// Initializes the map for the creation of the Activity Map.
function initializeMap(lat, lng){
	$('activity').innerHTML="";
		var myOptions = {
		center :new google.maps.LatLng(lat,lng),
		zoom : 14,
		mapTypeId : google.maps.MapTypeId.SATELLITE
	};
	div=document.createElement("div");
	div.setAttribute("id", "map_canvas");
	document.getElementById("activity").appendChild(div);
	div.style.height="600px";
	div.style.width="100%";
	div.style.display = 'block';
	div.style.position = 'fixed';
	div.style.top = "0px";
	div.style.left = "0px";
	// odd name because I'm pretty sure at some point there is a global variable named map.
	var mapInstance = new google.maps.Map(div, myOptions);
	return mapInstance;
}

// This function displays the hunt bounds on the right side of the form. Called from createHunt.html
function displayHuntBounds(){
	var bounds=JSON.parse(sessionStorage.toPlot);
	
	bounds=new google.maps.LatLngBounds(new google.maps.LatLng(bounds.minLat, bounds.minLng), new google.maps.LatLng(bounds.maxLat, bounds.maxLng)); // Convert the bounds to a google maps LatLngBounds object.
	
	// Initialize the options for the google maps.
	var myOptions = {
		center :new google.maps.LatLng(bounds.getCenter().lat(),bounds.getCenter().lng()),
		zoom : 14,
		mapTypeId : google.maps.MapTypeId.SATELLITE
	};
	var map=new google.maps.Map(document.getElementById("map"), myOptions);
	var rectangle=createRectangleOverlay(map, bounds);
	rectangle.setDraggable(false);
}

//KN: Hides the map. Used for when a user is selecting a location for an activity. When they're done and going back to the form, this is called.
function removeMap(){
	$('map_canvas').style.display = 'none';
	$('contents').style.display = 'block';
}

// Creates a Rectangle overlay on the passed map object, and then returns the rectangle overlay.
function createRectangleOverlay(map, bounds){
	var rectangleOverlay = new google.maps.Rectangle();
	var rectOptions = {
		strokeColor : "#B7DDF2",
		strokeOpacity : 0.7,
		strokeWeight : 2,
		fillColor : "#B7DDF2",
		fillOpacity : 0.25,
		map : map,
		bounds : bounds
	};
	rectangleOverlay.setOptions(rectOptions);
	return rectangleOverlay;
}


//Changes the coordinates to the coordinates of the address. Called when a teacher searches an address to select hunt location. 		
function searchAddress(){
	var address=document.getElementById("searchBar").value.replace(" ", "+"); //KN: Get rid of spaces in the query
	ajax("GET", "http://maps.googleapis.com/maps/api/geocode/json?address=" + address + "&sensor=true", function(event){ //KN: sensor=true means that user location was obtained from something like a GPS sensor.
		address=JSON.parse(event);
		console.log(address);

	// TODO:  Catch the error thrown if the string can not be parsed into a float.
	//KN: Get the map boundaries
	var southwestBounds=new google.maps.LatLng(
							address.results[0].geometry.location.lat-(GLOBALS.DEFAULT_RECT_SIZE/2.0),
							address.results[0].geometry.location.lng-(GLOBALS.DEFAULT_RECT_SIZE/2.0));
	var northeastBounds=new google.maps.LatLng(
							address.results[0].geometry.location.lat+(GLOBALS.DEFAULT_RECT_SIZE/2.0),
							address.results[0].geometry.location.lng+(GLOBALS.DEFAULT_RECT_SIZE/2.0));
	var bounds=new google.maps.LatLngBounds(southwestBounds, northeastBounds);
	var rectOptions = {
		bounds : bounds
	};

	//KN: Recenter the map onto the boundaries.
	rectangle.setOptions(rectOptions);
	rectangle.getMap().panTo(rectangle.getBounds().getCenter()); 
	}); //KN: Ajax callback ends here.
}

// Submits the new hunt, sending all data to createHunt.php which will put it in the database.	 Is called by the submit button in the gotoControlBox. 
function submitNewHunt(){
	var toPlot=JSON.parse(sessionStorage.toPlot); //KN: The boundaries of the map, set in displayNewHuntForm
	var additionalQuestions=new Object(); 
	additionalQuestions["questiona"]=document.getElementById("additionalQuestion1").value;
	additionalQuestions["questionb"]=document.getElementById("additionalQuestion2").value;
	additionalQuestions["questionc"]=document.getElementById("additionalQuestion3").value;
	var date=(Date.parse(document.getElementById("dateOfTrip").value)/1000)+86400 //KN: dateOfTrip.value will be a string like "12-31-2013", Date.parse will turn it into an integer of how many milliseconds between that date and January 1, 1970, 00:00:00 UTC. Divide that by 1000 (for seconds). 86400 is how many seconds are in a day. QUESTION: Why are we adding a day? Why in seconds? 
	ajax("title=" + document.getElementById("title").value +	//KN: Make a string with all the relevant values to be sent to createHunt.php
		"&username=" + document.getElementById("huntUsername").value +
		"&password=" + document.getElementById("password").value +
		"&maxLat=" + toPlot.maxLat +
		"&minLat=" + toPlot.minLat +
		"&minLng=" + toPlot.minLng +
		"&maxLng=" + toPlot.maxLng +
		"&start_lat=" + toPlot.startLat +
		"&start_lng=" + toPlot.startLng +
		"&additionalQuestions=" + JSON.stringify(additionalQuestions) +
		"&dateOfTrip=" + date
		, GLOBALS.PHP_FOLDER_LOCATION + "createHunt.php", function(serverResponse){
			if(serverResponse=="success") window.location.reload(); //KN: If the submission worked, then refresh the page 
			else console.log(serverResponse);
		});
	return false;
}

//KN: Moves a placemarker to specified coordinates. Used by the "Take me there" button for students trying to pick coordinates for their activity.
function takeMeThereActivity(toPlot){
	var latValue;
	var longValue;
	
	if (document.getElementById("decimalDMSSelect").selectedIndex == "0") //KN: 0 is Decimal, 1 is DMS. So if it in decimal, then directly take lat and long values.
	{
		latValue = document.getElementById("latitudeIn").value;
		longValue = document.getElementById("longitudeIn").value;
	}
	else{ //KN: Then they have chosen DMS. So take lat and long values, and check their directions (N/S, W/E). And then convert the values into decimal.
		var latDirection;
		var longDirection;
		if (document.getElementById("latNSSelect").selectedIndex == 0) { latDirection = "N"; } //KN: selectedIndex for both is the element number in the Select. N/W = 0. S/E = 1.
			else { latDirection = "S"; }
			if (document.getElementById("longNSSelect").selectedIndex == 0) { longDirection = "W"; }
			else { longDirection = "E"; }
				
			latValue = toDecimal(latDirection, document.getElementById("latDegrees").value, document.getElementById("latMinutes").value); 
			longValue = toDecimal(longDirection, document.getElementById("longDegrees").value, document.getElementById("longMinutes").value);
		}
		
	placeMarker(toPlot, new google.maps.LatLng(latValue, longValue));	//KN: Then, regardless of whether they used DMS or Decimal, move the placemarker.
}


//KN: This function will store new values and make a map view. Called when the user clicks the edit lat/lng button on the createHunt.html form.
function editHuntLatLng(){
	var form=document.getElementById("createHuntForm");
	var answers=new Object();
	for(var i = 0; i < form.length; i++) {
			answers[form[i].id] = form[i].value;
	}
	sessionStorage.huntInformation=JSON.stringify(answers);
	createhunt();
}

// This function removes the map display, and shows the new hunt form. Called from clicking the submit button in the new hunt control.
// The variable toPlot is the hunt boundaries. Store that into sessionStorage.
function displayNewHuntForm(toPlot){
	// Store toPlot into the sessionStorage.
	var bounds=new Object();
	bounds.maxLat=toPlot.getBounds().getNorthEast().lat();
	bounds.minLat=toPlot.getBounds().getSouthWest().lat();
	bounds.minLng=toPlot.getBounds().getSouthWest().lng();
	bounds.maxLng=toPlot.getBounds().getNorthEast().lng();
	bounds.startLat=toPlot.getBounds().getCenter().lat();
	bounds.startLng=toPlot.getBounds().getCenter().lng();
	sessionStorage.toPlot=JSON.stringify(bounds); 	//KN: Store the bounds
	
	var display=document.getElementById("activity");	// The display is going to be needed a lot, so store it in a variable for faster runtime.
	display.innerHTML=GLOBALS.createHunt; //KN: This will display createHunt.html (put into this variable in getConstants.js' createGlobalConstant
	// Force a DOM refresh.
	display.style.display="none";
	display.style.display="block";
	
	// If the user has previously entered information about the hunt, plug it in.
	if(sessionStorage.huntInformation!=""){
		var hunt=JSON.parse(sessionStorage.huntInformation);
		for(element in hunt){
			document.getElementById(element).value=hunt[element];
		}
	}
	
	displayHuntBounds();
}	

// Fills the goToControlbox (Where teachers select coordinates for the hunt) and sets up events. Called by createGotoControl
function initializeLatLng(toPlot, isRectangle){
	var latDMS = toDMS("lat", sessionStorage.lat); //KN: toDMS is defined in this file
	var lngDMS = toDMS("long", sessionStorage.lng);
	document.getElementById("decimalDMSSelect").value=1;
	document.getElementById("latNSSelect").value=(latDMS.compass=="N")? 0:1; //KN: Fill the direction and the degrees+minutes boxes with coordinate data
	document.getElementById("latDegrees").value=latDMS.degrees;
	document.getElementById("latMinutes").value=latDMS.minutes;
	document.getElementById("longNSSelect").value=(lngDMS.compass=="W")?0:1;
	document.getElementById("longDegrees").value=lngDMS.degrees;
	document.getElementById("longMinutes").value=lngDMS.minutes;
	google.maps.event.addDomListener(document.getElementById("decimalDMSSelect"), 'change', changeSelectedLatLngDisplay);
	
	
	//KN: Makes buttons do something -- either submit the data or update the map view. These are buttons within the gotocontrolbox (where users select location for something) 
	if(isRectangle){ //KN: teacher view.
		google.maps.event.addDomListener(document.getElementById("submitButton"), 'click', function(event){ displayNewHuntForm(toPlot); });
		google.maps.event.addDomListener(document.getElementById("takeMeThere"), 'click', function(event) { updateRectangle(toPlot);});
	} else{
		google.maps.event.addDomListener(document.getElementById("submitButton"), 'click', function(event){ GoToControlOnSubmit(); });
		google.maps.event.addDomListener(document.getElementById("takeMeThere"), 'click', function(event) { takeMeThereActivity(toPlot);});
	}
}

//KN: Changes the coordinate type and updates the contents in the fields. USed in the control box, called when the user changes between DMS and Decimal.
function changeSelectedLatLngDisplay(){
	var latValue = document.getElementById("latitudeIn").value;
	var longValue = document.getElementById("longitudeIn").value;
		
		//KN: If they selected DMS
		if (document.getElementById("decimalDMSSelect").selectedIndex == "1") 
		{
			document.getElementById("DMSLatLng").style.display = "block";		//KN: Then show the DMS elements (N/S and E/W, Degrees+Minutes)
			document.getElementById("decimalLatLng").style.display = "none";	//KN: And hide decimal elements (Lat/Lng)

			updateLatLngDMS(new google.maps.LatLng(latValue, longValue));
		}

		//KN: If they selected Decimal
		else 
		{
			document.getElementById("DMSLatLng").style.display = "none";		//KN: Then hide DMS elements (N/S and E/W, Degrees+Minutes)
			document.getElementById("decimalLatLng").style.display = "block"; 	//KN: And show decimal elements (Lat/Lng)
			
			var latDirection;
			var longDirection;

			//KN: Set the directions
			if (document.getElementById("latNSSelect").selectedIndex == 0) { latDirection = "N"; }
			else { latDirection = "S"; }
			if (document.getElementById("longNSSelect").selectedIndex == 0) { longDirection = "W"; }
			else { longDirection = "E"; }
			
			//KN: Convert the Decimal values to DMS and fill the fields with them.
			var latDec = toDecimal(latDirection, document.getElementById("latDegrees").value, document.getElementById("latMinutes").value);
			var lngDec = toDecimal(longDirection, document.getElementById("longDegrees").value, document.getElementById("longMinutes").value);
			// If width and height DMS values exist, set width and height to them.  otherwise set them to null.
			updateLatLngBox(new google.maps.LatLng(latDec, lngDec), true);
		}
	
}

// This function fills an html div, for selecting coordinates of a hunt/activity, seen on the map view.
function createGotoControl(map, center, onSubmit, toPlot, isRectangle)
{
	var ctrlDiv = document.createElement('div');
	var latDMS = toDMS("lat", center.lat());
	var lngDMS = toDMS("long", center.lng());
	
	// Right now, I've seperated out the new Hunt control box into an HTML file, and so when it's a rectangle we will just load the HTML file and then plug in the values where needed.
	if(isRectangle){
		ajax("GET", GLOBALS.HTML_FOLDER_LOCATION + "newHuntControl.html", function(serverResponse){
			document.body.appendChild(ctrlDiv);
			ctrlDiv.innerHTML=serverResponse;
			map.controls[google.maps.ControlPosition.BOTTOM_LEFT].push(ctrlDiv);
			// Changing the display to none/block is a reliable way to refresh the DOM.
			ctrlDiv.style.display="none";
			ctrlDiv.style.display="block";
			initializeLatLng(toPlot, isRectangle);
			document.body.removeChild(ctrlDiv);
			});
		sessionStorage.lat=center.lat();
		sessionStorage.lng=center.lng();
		return;
	} else{
		ajax("GET", GLOBALS.HTML_FOLDER_LOCATION + "newActivityControl.html", function(serverResponse){
			ctrlDiv.innerHTML=serverResponse;
			map.controls[google.maps.ControlPosition.BOTTOM_LEFT].push(ctrlDiv);
			sessionStorage.lat=center.lat();
			sessionStorage.lng=center.lng();
			setTimeout(function(){initializeLatLng(toPlot, isRectangle);}, 750);
		});
	
	}
}
// Updates the GoToControlBox from decimal to DMS.
function updateLatLngDMS(location, isRectangle) {
	latDMS = toDMS("lat", location.lat());	//KN: toDMS() is defined in this file
	longDMS = toDMS("long", location.lng());
	
	if (latDMS.compass == "N") { document.getElementById('latNSSelect').selectedIndex = 0; } //KN: .selectedIndex is the element number within a Select dropdown. 0 is the first element.
	else { document.getElementById('latNSSelect').selectedIndex = 1; }
	if (longDMS.compass == "W") { document.getElementById('longNSSelect').selectedIndex = 0; }
	else { document.getElementById('longNSSelect').selectedIndex = 1; }

	document.getElementById('latDegrees').value = latDMS.degrees;
	document.getElementById('latMinutes').value = latDMS.minutes;
	
	document.getElementById('longDegrees').value = longDMS.degrees;
	document.getElementById('longMinutes').value = longDMS.minutes;
	if(isRectangle){
		document.getElementById("DMSWidth").value=document.getElementById("widthIn").value;
		document.getElementById("DMSHeight").value=document.getElementById("heightIn").value;
	}
}

// Updates the GoToControlBox when going to Decimals.
function updateLatLngBox(location, isRectangle) {
	document.getElementById('latitudeIn').value = location.lat().toFixed(5);
	document.getElementById('longitudeIn').value = location.lng().toFixed(5);
}

// Is called when the bounds of the rectangle are changed.
// Updates the latLng box to show the new width, height, lat, and lng.
function updateWidthHeight(bounds){
	// Sets up the width and height for both of the boxes.
	//var width=bounds.getNorthEast().lat()-bounds.getSouthWest().lat();
	//var height=bounds.getNorthEast().lng()-bounds.getSouthWest().lng();
	//document.getElementById("widthIn").value=width;
	//document.getElementById("DMSWidth").value=width;
	//document.getElementById("heightIn").value=height;
	//document.getElementById("DMSHeight").value=height;
	// Set up the lat/lng for the decimal box.
	document.getElementById("latitudeIn").value=bounds.getCenter().lat();
	document.getElementById("longitudeIn").value=bounds.getCenter().lng();
	// This fancy code is needed to set up the lat/lng for the DMS boxes.
	var lat=toDMS("lat", bounds.getCenter().lat());
	var lng=toDMS("long", bounds.getCenter().lng());
	document.getElementById("latNSSelect").value=(lat.compass=="N")? 0:1;
	document.getElementById("latDegrees").value=lat.degrees;
	document.getElementById("latMinutes").value=lat.minutes;
	document.getElementById("longNSSelect").value=(lng.compass=="E")? 1:0;
	document.getElementById("longDegrees").value=lng.degrees;
	document.getElementById("longMinutes").value=lng.minutes;
}
	
// Converts the coordinates to DMS.
function toDMS(direction, deg) {
	var compass;
	if ((direction == "lat") && (deg < 0)) {
		compass = "S";
	}
	else if ((direction == "lat") && (deg > 0)) {
		compass = "N";
	}
	else if ((direction == "long") && (deg < 0)) {
		compass = "W";
	}
	else if ((direction == "long") && (deg > 0)) {
		compass = "E";
	}
	
	var degrees;

	if (deg < 0) {
		deg = deg * -1;
	}
	degrees = Math.floor(deg);
	degrees = degrees.toFixed();
	
	var minutes_seconds = (deg % 1) * 60;
	var minutes = Math.floor(minutes_seconds);
	minutes = minutes.toFixed();
	var seconds = Math.round((minutes_seconds % 1) * 100);
	seconds = seconds.toFixed();
	
	return {
		'compass': compass,
		'degrees': degrees,
		'minutes': minutes + "." + seconds
	};
}

// This is the function that is called by the take me there! button.
// It's purpose is to change the rectangle to fit the typed in criteria.
function updateRectangle(rectangle){
	var northeastBounds;
	var southwestBounds;
	// Make sure that we read the currently showing lat/lng.
	if(document.getElementById("decimalDMSSelect").value==0){
	// TODO:  Catch the error thrown if the string can not be parsed into a float.
		southwestBounds=new google.maps.LatLng(
							parseFloat(document.getElementById("latitudeIn").value)-parseFloat(GLOBALS.DEFAULT_RECT_SIZE)/2.0,
							parseFloat(document.getElementById("longitudeIn").value)-parseFloat(GLOBALS.DEFAULT_RECT_SIZE)/2.0);
		northeastBounds=new google.maps.LatLng(
							parseFloat(document.getElementById("latitudeIn").value)+parseFloat(GLOBALS.DEFAULT_RECT_SIZE)/2.0,
							parseFloat(document.getElementById("longitudeIn").value)+parseFloat(GLOBALS.DEFAULT_RECT_SIZE)/2.0);
	} else{
		var direction=(document.getElementById("latNSSelect").value==0) ? "N" : "S";
		var lat=toDecimal(direction, document.getElementById("latDegrees").value,
									document.getElementById("latMinutes").value);
		direction=(document.getElementById("longNSSelect").value==0) ? "W" : "E";
		var lng=toDecimal(direction, document.getElementById("longDegrees").value,
									document.getElementById("longMinutes").value);
		southwestBounds=new google.maps.LatLng(lat-GLOBALS.DEFAULT_RECT_SIZE/2,
												lng-GLOBALS.DEFAULT_RECT_SIZE/2);
		northeastBounds=new google.maps.LatLng(lat+GLOBALS.DEFAULT_RECT_SIZE/2,
												lng+GLOBALS.DEFAULT_RECT_SIZE/2);
	}
		bounds=new google.maps.LatLngBounds(southwestBounds, northeastBounds);
	var rectOptions = {
		bounds : bounds
	};
	rectangle.setOptions(rectOptions);
	rectangle.getMap().panTo(rectangle.getBounds().getCenter());
}

// Converts DMS Coordinates to decimal.
function toDecimal(direction, deg, minutes) {
	minutes = parseFloat(minutes);
	deg = parseFloat(deg);
	var seconds = (Math.floor(minutes) * 60) + ((minutes % 1) *60);
	
	var degrees = deg + (seconds / 3600);
	if ((direction == "W") || (direction == "S")) {
		degrees = degrees * -1;
	}

	return degrees;
}