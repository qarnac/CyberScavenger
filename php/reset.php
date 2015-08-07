	<?php
	ini_set('display_errors', 'On');
	error_reporting(E_ALL);
	include '../php/credentials.php';
	include '../php/getConstants.php';
	$token = $_GET['token'];
	$mail = $_GET['emailAddress'];
	$result = mysql_query("SELECT * FROM `password_reset` WHERE token='$token'");
	if(mysql_num_rows($result)>0)
	{
		while($x=mysql_fetch_assoc($result))
			{
				echo 'success';
				mysql_query("INSERT into `password_reset`".
					"SET valid='true' where token='" . $token . "';") or die(mysql_error()); 
				$result_teacher = mysql_query("SELECT * FROM teacher WHERE mail='$mail'");
				if(mysql_num_rows($result_teacher) > 0)
				{
					echo "
					<script src='js/login.js'></script>
					<script src='js/main.js'></script>
					<form id='login' action='reset.php' method = 'POST'>
					    <h1>Log In</h1>
					    <fieldset id='inputs'>
					        <input name='password' type='password' placeholder='Password' autofocus required>
					        <input name='confirmpassword' type='password' placeholder='Confirm Password' required>
					    </fieldset>
					    <fieldset id='actions'>
					        <button id='submit' value='Log in' name = 'submit'> OK </button>
					    </fieldset>
					</form>";
					if (isset($_POST['submit']))
					{
						$password = $_POST['password'];
						$confirmpassword = $_POST['confirmpassword'];
						if($password == $confirmpassword)
						{
							$options = [
    						'cost' => 11,
    						'salt' => mcrypt_create_iv(22, MCRYPT_DEV_URANDOM),
							];
						$newpassword = password_hash($_POST['password'], PASSWORD_BCRYPT, $options);
						mysql_query("UPDATE teacher SET password = '" . $newpassword . "'
							where mail='
							" . $mail ."';") or die(mysql_error());
						echo 'success';

						}
						else{
							echo 'Passwords are not matching';
						}
					}

				}
				else
				{
					echo 'invalid email address';
				}

			}

	}
	else
	{
		echo 'Invalid Token!';
	}
	?>