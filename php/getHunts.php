<?php
session_start();
include '../php/credentials.php';

//KN: $_SESSION['who'] is defined as student or teacher at the time of login.
//KN: If they are not logged in, they will only get to see the hunts and activities already made, not modify them in any way.
if ($_POST['what']=='hunts' && $_SESSION['who']=='students') {
	getHuntsStudent();
}
else if ($_POST['what']=='hunts' && $_SESSION['who']=='teacher') {
	getHuntsTeacher();
}
else {
	include dirname(__FILE__) . '/getActivity.php';  
}

// Echos temp, which contains users first name, list of their hunts that are open, and the form data from createActivity.html
// Why does this also grab the create activity form?  Could we do that once the user clicks new activity instead?
//KN: getHuntsStudent() gets all of the hunts that the logged-in student can access, as well as the form for making a new activity in a hunt
function getHuntsStudent()
{
	$createActivityForm = file_get_contents("http://ouyangdev.cs.csusm.edu/cyberhawk/quest/html/createActivity.html"); //KN: The form for students to enter an activity for their assigned hunt
	$availableHunts = array();
	$student= mysql_query("SELECT * FROM students WHERE id=" . $_SESSION['id']); //KN: Find the student in the database
	$student=mysql_fetch_assoc($student); //KN: Turn the student from the previous line into an associative array.
	$result = mysql_query("
		SELECT *
		FROM hunt
		WHERE teacher_id='".$_SESSION['teacher_id']."'"
		) or die(mysql_error()); //KN: Find the hunts owned by the student's teacher in the database

	if(mysql_num_rows($result) > 0) //KN: If at least 1 entry was found for allowed hunts,
	{
		while($x = mysql_fetch_assoc($result)) {
			array_push($availableHunts,$x); //KN: Add them to the availableHunts array
		}
	}
	else {
		echo "sessionfail result <= 0";
	}
	$temp[0]= json_encode($student); //KN: Make a json string of the array of the student
	$temp[1]=$availableHunts;
	$temp[2]=$createActivityForm;
	echo json_encode($temp); //KN: Make a json string of the student's array, all of the hunts they are allowed to access, and of the form for creating activity in a hunt.
}

//KN: getHuntsTeacher() finds all of the hunts that the logged-in teacher has created. 
function getHuntsTeacher()
{
	$availableHunts = array(); //A new array to hold all of the hunts owned by the teacher currently logged in
	$result = mysql_query(" 
		SELECT *
		FROM hunt
		WHERE teacher_id='" . $_SESSION['id'] . "'"
		) or die(mysql_error()); //KN: result will find all of the hunts for the teacher who is logged in.
	if (mysql_num_rows($result) > 0) { //KN: If there is at least 1 entry found
		while ($x = mysql_fetch_assoc($result)) { //KN: Go through the entries
			array_push($availableHunts, $x); //KN: and add each one to the array 
		}
	}
	$temp[0] = $_SESSION['firstname']; 
	$temp[1] = $availableHunts;
	$temp = json_encode($temp); //KN: Combines the user's name and the list of hunts
	echo $temp; //KN: Returns that new json string
}
?>