// This is the function that seems to initialize the map on the left?
// topMap is the google map object being passed to this function.
// I really have no idea what all of the values being set to for the sideMap are
// used for.
var jMap;
function SideMap(topMap) {
	var me = this;
	jMap=me;
	me.imagepath = "images/hawks/car_left_";

	me.topMap = topMap;
	me.mapLevel = 11;

	me.centLat = 33.271273;
	me.centerLong = -116.403151;
	me.heading = 90;
	me.centerAlt = 0;

	me.loopCounter = 0;
	me.carMarker = null;

	var carIcon;
	var markerOptions;
	var iconWidth=20;
	var iconHeight=20;
	topMap.setCenter(new google.maps.LatLng(me.centLat, me.centerLong));
	topMap.setZoom(10);
	var Icon = new google.maps.MarkerImage(
		me.imagepath + "0.png",
		null, /* size is determined at runtime */
		null, /* origin is 0,0 */
		new google.maps.Point(10,10), /* anchor is bottom center of the scaled image */
		new google.maps.Size(20, 20)
	);  
	me.carMarker=new google.maps.Marker({
      position: new google.maps.LatLng(me.centLat, me.centerLong),
      map: me.topMap,
      icon: Icon
	});
}

SideMap.prototype.setZoomLevel = function(lv) {
	var me = this;

	me.mapLevel = lv;
	me.topMap.setCenter(new google.maps.LatLng(me.centLat, me.centerLong), me.mapLevel);
}

SideMap.prototype.refresh = function(centLat, centerLong, centerAlt, heading )
{
	var me = this;

	me.centLat = centLat;
	me.centerLong = centerLong;
	me.centerAlt = centerAlt;
	me.heading = heading;

    // Makes sure that the map is initialized
    if(ge)
    {
        me.loopCounter++;
        
        if(me.loopCounter % 10 == 0)
        {
            me.topMap.setCenter(new google.maps.LatLng(me.centLat, me.centerLong), me.mapLevel); 
            
			// Do this because the way we generate the image headings are backwards.
            me.heading = me.heading * -1; 

            // Calculate image to use.
            if(me.heading < 0)
                me.heading = 360 + me.heading;
            var closestHeadingDirection = Math.round(me.heading / 10)*10;
            var locationOfFile = me.imagepath + closestHeadingDirection + ".png";
            //if(!reachedPlace) { alert("Reached line" + locationOfFile); reachedPlace = true; }
				var Icon = new google.maps.MarkerImage(
					locationOfFile,
					null, /* size is determined at runtime */
					null, /* origin is 0,0 */
					new google.maps.Point(10,10), /* anchor it on the center */
					new google.maps.Size(20, 20)
				);  
            me.carMarker.setIcon(Icon);
            
            // We subtract .001 from the location for the top view car marker because the Longitude on the top view isn't exactly lined
            // up with the marker locations on the 3D view. The .001 accounts for that discrepecny. -- Added by Paul
            var point = new google.maps.LatLng(me.centLat,me.centerLong - .001);
            me.carMarker.setPosition(point);
            //var point = new GLatLng(centLat,centerLong);
            //var movingMarker = new GMarker(point, markerOptions);
            //topMap.addOverlay(movingMarker);
            
        } // Loop count check to prevent extra processing.

        if(me.loopCounter > 100000)
        {
            me.loopCounter = 0;
        }
     }
}
