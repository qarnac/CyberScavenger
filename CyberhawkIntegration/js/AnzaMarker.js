/**
 * @author lifedim
 */

function AnzaMarker(_type, _title, _synopsis, _lat, _lng, _icon)
{
	var me = this;

	me.type = _type;
	me.title = _title;
	me.synopsis = _synopsis;
	me.lat = _lat;
	me.lng = _lng;
	me.icon = _icon;

	me.pageCount = 0;

	// may create only one Page object array later
	me.pages = new Array(); // store pages' path
	me.pagesStatus = new Array(); // store pages' status, 1 open 2 solved 0 hide
	me.pagesName = new Array(); // store page's name shown in tabbar

	me.status = 0; // 0 unsolved, 1 solved
	me.score = 0;
	me.note = "note goes to here ... ";
	
	me.marker = null; // Google earth marker object
	me.gmMarker = null; // Google Map Marker object
	
	//marker 3d model in earth
	me.circleLink = null;
	me.circlePlacement = null;
}

AnzaMarker.prototype.addScore = function(add_score) {
	var me = this;
	me.score += add_score;
}

AnzaMarker.prototype.getScore = function() {
	var me = this;
	return me.score;
}

AnzaMarker.prototype.addPage = function(path, name, status)
{
	var me = this;
	me.pages[me.pageCount] = path;
	me.pagesName[me.pageCount] = name;
	me.pagesStatus[me.pageCount] = status;
	me.pageCount++;
}

AnzaMarker.prototype.getPagePath = function(no)
{
	var me = this;
	if ( no < 1 || no > me.pageCount )
		return null;
	return me.pages[no-1];
}

AnzaMarker.prototype.getPageName = function(no)
{
	var me = this;
	if ( no < 1 || no > me.pageCount )
		return null;
	return me.pagesName[no-1];
}

AnzaMarker.prototype.getPageStatus = function(no)
{
	var me = this;
	if ( no < 1 || no > me.pageCount )
		return null;
	return me.pagesStatus[no-1];
}

AnzaMarker.prototype.setPageStatus = function(no, newstatus)
{
	var me = this;
	if ( no < 1 || no > me.pageCount )
		return null;
	me.pagesStatus[no-1] = newstatus;
}

AnzaMarker.prototype.setNode = function(note)
{
	var me = this;
	me.note = note;
}

AnzaMarker.prototype.getNode = function()
{
	var me = this;
	return me.note;
}


// The function to add a google map marker object to a google map.
// Parameter gm is the google map object.
AnzaMarker.prototype.addGMMarker = function(gm)
{
	this.gmMarker.setMap(gm);
}

AnzaMarker.prototype.openBalloon = function(ge)
{
	var me = this;
	var balloon = ge.createHtmlDivBalloon('');
	//balloon.setMinWidth(400);
	balloon.setMaxWidth(700);
	balloon.setFeature(me.marker);	
	var div = document.createElement('DIV');
	div.innerHTML = "<center><red><h3>" + me.title + "</h3></red></center>";
	//div.innerHTML = me.content.getHtmlContent();
	balloon.setContentDiv(div);
	ge.setBalloon(balloon);
}

AnzaMarker.prototype.closeBalloon = function(ge)
{
	var me = this;
	ge.setBalloon(null);
}

AnzaMarker.prototype.initGEMarker = function(ge)
{
	var placemark = ge.createPlacemark('');
	// Set the placemark's location.  
	var point = ge.createPoint('');
	point.setLatitude(parseFloat(this.lat));
	point.setLongitude(parseFloat(this.lng));
	placemark.setGeometry(point);

	// Add the placemark to Earth.
	ge.getFeatures().appendChild(placemark);
}

//For google map
AnzaMarker.prototype.initGMMarker = function(gm)
{
	var me = this;
	var questionIcon;
	var markerOptions = { icon:'images/icon/ball_green.png'};
	if ( me.type == 'clue' )
		var markerOptions = { icon:'images/icon/ball_green.png'};
	else if (me.type == 'question' )
		var markerOptions = { icon:'images/icon/ball_red.png'};
	
	me.gmMarker = new google.maps.Marker(new google.maps.LatLng(me.lat, me.lng), markerOptions);	
}
