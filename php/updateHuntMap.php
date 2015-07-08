<?php 
	include '../php/credentials.php';
	include '../php/getConstants.php';
	session_start();
	$hunt_id=$_POST["id"];
	mysql_query("UPDATE `hunt` " . 
	"SET minlat='" . mysql_escape_string($_POST["minLat"]) . 
	"', minlng='" . mysql_escape_string($_POST["minLng"]) . 
	"', maxlat='" . mysql_escape_string($_POST["maxLat"]) . 
	"', maxlng='" . mysql_escape_string($_POST["maxLng"]) .
	"', start_lat='" . mysql_escape_string($_POST["start_lat"]) .
	"', start_lng='" . mysql_escape_string($_POST["start_lng"]) .
	"' where id='" . $hunt_id .
	"' and teacher_id='" . $_SESSION['id'] . "';") or die(mysql_error());
	echo 'success';
	?>