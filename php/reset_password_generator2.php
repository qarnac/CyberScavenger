<?php
$options = [
    'cost' => 11,
    'salt' => mcrypt_create_iv(22, MCRYPT_DEV_URANDOM),
];
echo password_hash("raquel", PASSWORD_BCRYPT, $options)."\n";
$stored_value = password_hash("raquel", PASSWORD_BCRYPT, $options);
if(password_verify("raquel",$stored_value)){
echo 'you are in';
}
else{
	echo 'try again';
}
?>