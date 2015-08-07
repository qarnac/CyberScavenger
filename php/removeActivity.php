<?php
	include '../php/credentials.php';
	include '../php/getConstants.php';
	session_start();
	$activity_id = $_POST['id'];
	mysql_query("DELETE FROM `stud_activity` where id ='" . $activity_id .
	 "';") or die(mysql_error());
	echo "success";
?>