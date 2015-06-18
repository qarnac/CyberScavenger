<?php
	include '../php/credentials.php';
	include '../php/getConstants.php';
	
	session_start();


	$hunt_id=$_POST["id"];
	mysql_query("UPDATE `hunt` " . 
	"SET title='" . mysql_escape_string($_POST["title"]) . 
	"', additionalQuestions='" . mysql_escape_string($_POST["additionalQuestions"]) .
	"' where id='" . $hunt_id .
	"' and teacher_id='" . $_SESSION['id'] . "';") or die(mysql_error());
	
	$huntId=$_POST["ïd"];
	mysql_query("UPDATE `students`".
		"SET username='" . mysql_escape_string($_POST["username"]) . 
		"', firstname='" . mysql_escape_string($_POST["username"]) .
		"', password='" . mysql_escape_string($_POST["password"]) .
		"', lastname='" . mysql_escape_string($_POST["password"]) .
		"', id='" . mysql_insert_id() .
		"' where teacher_id='" . $_SESSION['id'] .
		"' and parentHunt='" . $huntId .
		"';") or die(mysql_error());
		
		echo "success";
	?>