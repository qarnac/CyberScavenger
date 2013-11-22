/**
 * @author sabareesh kkanan subramani
 * This script is used by index.php this helps in login the user
 */


//KN: Passes login info to server.
//KN: Every hunt is given an ID, and students need to select a hunt in order to log in. So parentHunt is the number of that ID. Teachers can log in without selecting a hunt, in which case, parenthunt=0, else it gets set the same way as for the students.
function verify()
{
	var user=$('username').value; //KN: Take the input from username and password fields.
	var pwd=$('password').value;
	var who=getQueryVariable("who"); //KN: This is whether the person is logging in as a student or teacher
	var parentHunt=getQueryVariable("parentHunt"); 
	var data="user="+user+"&pwd="+pwd+"&who="+who+"&parent=" +parentHunt;
	ajax(data, GLOBALS.PHP_FOLDER_LOCATION + "login.php",verifyLogin); //KN: Pass the login info to login.php and then performs verifyLogin.
	return false;
}

//KN: Allows you to access an element by it's ID. e.g. for one with id="myelement", you can say $('myelement') (Basically like the jQuery call just without the #)
function $(x){return document.getElementById(x);}

//KN: This function responds to the credentials being right or wrong, by either refreshing or alerting respectively. Called as part of verify(). x is echoed from login.php.
function verifyLogin(x)
{
	if(x=="true")
	window.location.reload();
	else if(x=="false")
	alert("Username or Password is not correct");
}

//KN: This function looks for a certain variable within the URL. Used in verify().
/*KN: split() takes a string and splits it into an array, with elements being the contents between the key.
	With the string "who=teacher&parentHunt=0", calling split('&') will create the strings "who=teacher" and "parentHunt=0"
	Then split('=') will create the strings "who" and "teacher", and "parentHunt" and "0"
	*/
function getQueryVariable(variable) {
    var query = window.location.search.substring(1); 	//KN: Takes the url (which contains the 'who' and 'parentHunt') and puts it into a string
    var vars = query.split('&'); 						
    for (var i = 0; i < vars.length; i++) { 
        var pair = vars[i].split('='); 					
        if (decodeURIComponent(pair[0]) == variable) { 	
            return decodeURIComponent(pair[1]);			
        }
    }
    console.log('Query variable %s not found', variable);
}