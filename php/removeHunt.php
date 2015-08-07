<?php
	include '../php/credentials.php';
	include '../php/getConstants.php';
	session_start();
	$hunt_id = $_POST['id'];
	mysql_query("DELETE FROM `hunt` where id ='" . $hunt_id .
	 "';") or die(mysql_error());
	echo "success";
?>