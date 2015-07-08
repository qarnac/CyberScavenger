<?php
$email_to="raquel.natali95@gmail.com";
$email_subject="It works";
$email_message="Hello. I can send mail!";
$headers = "From: Beacze\r\n".
"Reply-To: raquel.natali95@hotmail.com\r\n'" .
"X-Mailer: PHP/" . phpversion();
mail($email_to, $email_subject, $email_message, $headers);  
echo "mail sent!"
?>