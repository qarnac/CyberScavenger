<?php
if(!isset($_SESSION)) session_start();
include '../php/credentials.php';

if (isset($_POST['id'])) { //If a hunt is selected:
	$studentactivities = mysql_query("
		SELECT stud_activity.*, students.firstname, students.lastname
		WHERE stud_activity.hunt_id='" . mysql_escape_string($_POST['id']) . "' 
		FROM stud_activity, students
		AND students.id=stud_activity.student_id"
		) or die(mysql_error()); //KN: Get the student activities for a selected hunt

	if (mysql_num_rows($studentactivities) == 0) { //checks atleast for one student activity 
		echo "none";
	} else {
		$z = array(); // Temporary variable used to convert mysql resource to array
		while ($m = mysql_fetch_assoc($studentactivities)) { 
			array_push($z, $m); //KN: Push all of the entries from the studentactivities query into an array
		}
		echo json_encode($z); //KN: And echo that array of activities
	}

} 
else {
	echo 'No post data';
}
?>