<?php
$to      = 'raquel.natali95@gmail.com';
$subject = 'Teacher is asking password from CyberQUEST Scavenger';
$message =" Message: " . $_POST['message'] . " \n \n School:" . $_POST['school'] . "\n \n Teacher:" . $_POST['name'] . "\n  \n E-mail:" . $_POST['mail'];
$from = "From:CyberQUEST \r\n " . 
"Reply-To: raquel.natali95@gmail.com\r\n'" .
"X-Mailer: PHP/" . phpversion();

mail($to, $subject, $message, $from);
?> 