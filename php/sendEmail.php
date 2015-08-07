<?php
ini_set('display_errors', 'On');
error_reporting(E_ALL);
include '../php/credentials.php';
include '../php/getConstants.php';
$email = mysql_real_escape_string($_POST['mail']);  // SECURITY!
$result = mysql_query("SELECT * FROM teacher WHERE mail='$email'");
if (mysql_num_rows($result)<1) {
    echo 'E-mail does not exist.';
} 

else 
{
	while($x=mysql_fetch_assoc($result))
			{
				date_default_timezone_set('America/Los_Angeles');
				$info = getdate();
				$hour = $info['hours'];
			    $length = 60;
				$token = genKey($length);
				mysql_query("INSERT into `password_reset`".
					"SET token='" . $token . 
					"', datetime='" . $hour .
					"', teacher_id='" . $result['id'] . "';") or die(mysql_error());
				$to = $_POST['mail'];
				$subject = 'You have requested a new password!';
				$message =" Follow the link below to change your password. If you didn't request a 
				new password, please disregard this e-mail. \n \n Link to change your password: https://ouyangdevvm.cs.csusm.edu/cyberscavenger/php/reset.php?token=" . $token ."&emailAddress=" . $_POST['mail'];
				$from = "From:CyberQUEST \r\n " . 
				"Reply-To: raquel.natali95@gmail.com\r\n'" .
				"X-Mailer: PHP/" . phpversion();
				mail($to, $subject, $message, $from);
				
			}

}

//echo $result;
function genKey($length) {
  if($length > 0) { 
	  $rand_id="";
		for($i=1; $i <= $length; $i++) {
		 mt_srand((double)microtime() * 1000000);
		 $num = mt_rand(1,72);
		 $rand_id .= assign_rand_value($num);
		}
  }
	return $rand_id;
}

function assign_rand_value($num) {
  switch($num) {
    case "1":
     $rand_value = "a";
    break;
    case "2":
     $rand_value = "b";
    break;
    case "3":
     $rand_value = "c";
    break;
    case "4":
     $rand_value = "d";
    break;
    case "5":
     $rand_value = "e";
    break;
    case "6":
     $rand_value = "f";
    break;
    case "7":
     $rand_value = "g";
    break;
    case "8":
     $rand_value = "h";
    break;
    case "9":
     $rand_value = "i";
    break;
    case "10":
     $rand_value = "j";
    break;
    case "11":
     $rand_value = "k";
    break;
    case "12":
     $rand_value = "l";
    break;
    case "13":
     $rand_value = "m";
    break;
    case "14":
     $rand_value = "n";
    break;
    case "15":
     $rand_value = "o";
    break;
    case "16":
     $rand_value = "p";
    break;
    case "17":
     $rand_value = "q";
    break;
    case "18":
     $rand_value = "r";
    break;
    case "19":
     $rand_value = "s";
    break;
    case "20":
     $rand_value = "t";
    break;
    case "21":
     $rand_value = "u";
    break;
    case "22":
     $rand_value = "v";
    break;
    case "23":
     $rand_value = "w";
    break;
    case "24":
     $rand_value = "x";
    break;
    case "25":
     $rand_value = "y";
    break;
    case "26":
     $rand_value = "z";
    break;
    case "27":
     $rand_value = "0";
    break;
    case "28":
     $rand_value = "1";
    break;
    case "29":
     $rand_value = "2";
    break;
    case "30":
     $rand_value = "3";
    break;
    case "31":
     $rand_value = "4";
    break;
    case "32":
     $rand_value = "5";
    break;
    case "33":
     $rand_value = "6";
    break;
    case "34":
     $rand_value = "7";
    break;
    case "35":
     $rand_value = "8";
    break;
    case "36":
     $rand_value = "9";
    break;
    case "37":
     $rand_value = "*";
    break;
    case "38":
     $rand_value = "~";
    break;
    case "39":
     $rand_value = "-";
    break;
    case "40":
     $rand_value = "|";
    break;
    case "41":
     $rand_value = "^";
    break;
    case "42":
     $rand_value = "%";
    break;
    case "43":
     $rand_value = " ";
    break;
    case "44":
     $rand_value = "_";
    break;
    case "45":
     $rand_value = "+";
    break;
    case "46":
     $rand_value = "=";
    break;
    case "47":
     $rand_value = "A";
    break;
    case "48":
     $rand_value = "B";
    break;
    case "49":
     $rand_value = "C";
    break;
    case "50":
     $rand_value = "D";
    break;
    case "51":
     $rand_value = "E";
    break;
    case "52":
     $rand_value = "F";
    break;
    case "53":
     $rand_value = "G";
    break;
    case "54":
     $rand_value = "H";
    break;
    case "55":
     $rand_value = "I";
    break;
    case "56":
     $rand_value = "J";
    break;
    case "57":
     $rand_value = "K";
    break;
    case "58":
     $rand_value = "L";
    break;
    case "59":
     $rand_value = "M";
    break;
    case "60":
     $rand_value = "N";
    break;
    case "61":
     $rand_value = "O";
    break;
    case "62":
     $rand_value = "P";
    break;
    case "63":
     $rand_value = "Q";
    break;
    case "64":
     $rand_value = "R";
    break;
    case "65":
     $rand_value = "S";
    break;
    case "66":
     $rand_value = "T";
    break;
    case "67":
     $rand_value = "U";
    break;
    case "68":
     $rand_value = "V";
    break;
    case "69":
     $rand_value = "W";
    break;
    case "70":
     $rand_value = "X";
    break;
    case "71":
     $rand_value = "Y";
    break;
    case "72":
     $rand_value = "Z";
    break;
  }
return $rand_value;
}
?> 