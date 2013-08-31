<?php
// If the user is logged in, loads the correct html page for that user.  Otherwise, it shows the log in form.
include dirname(__FILE__) . '/html/header.html'; 	//KN: finds the directory name of the current file (index.php), and concatenates the string. Include that result.
session_start(); 


//KN: $_SESSION is an associative array, the contents within [] are elements. 
if(isset($_SESSION['login'])==true )				//KN: If someone has logged in
{
	if($_SESSION['who']=='students')				//KN: ...If they logged in as student
		include dirname(__FILE__) . '/html/user.html'; //KN: Then go to the user page
	else if($_SESSION['who']=='teacher')			//KN: Else, they were logged in as a teacher
		include dirname(__FILE__) . '/html/teacher.html'; //KN: So go to the teacher page
}
//KN: Otherwise, not logged in
// else give them the public view.
else {
include dirname(__FILE__) . '/html/index.html'; //KN: So, go to the normal start page
}
?>

</html>
