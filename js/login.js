/**
 * @author sabareesh kkanan subramani
 * This script is used by index.php this helps in login the user
 */
/*KN: Used by public.
Called in log_in_form.html

This script is for logging into the website, either as a student or as a teacher. 
*/ 
//passes user info to server to check credentials
//KN: Takes the input information, turns it into a string for the database, and sends it to the database via an ajax request.
function verify()
{
	var user=$('username').value; //KN: Take the value from the username field of the page 
	var pwd=$('password').value;
	var who=getQueryVariable("who"); //KN: This is whether the person is logging in as a student or teacher
	var parentHunt=getQueryVariable("parentHunt"); //KN: Every hunt is given an ID, and students need to select a hunt in order to log in. So parentHunt is the number of that ID. Teachers can log in without selecting a hunt, in which case, parenthunt=0, else it gets set the same way as for the students.
	var data="user="+user+"&pwd="+pwd+"&who="+who+"&parent=" +parentHunt;
	ajax(data, GLOBALS.PHP_FOLDER_LOCATION + "login.php",verifyLogin); //KN: QUESTION: Am I correct in thinking that it runs data through login.php, and when that process completes, it executes verifyLogin? And is the x variable in verifyLogin coming from the echo true/false in login.php?
	return false;
}

//KN: QUESTION: What does this do? Does this mean that if I have an html element named #theinput, I can access it as $(theinput)? 
function $(x){return document.getElementById(x);}

//reacts according to the verification of credentials. if correct just refresh the page that will redirect to different page which has user functionalities
//KN: Called as part of verify(), where x is the result echoed from login.php. True meaning that the login attempt was successful, in which case, it will reload the page (which will then show the user dashboard)
function verifyLogin(x)
{
	if(x=="true")
	window.location.reload();
	else if(x=="false")
	alert("Username or Password is not correct");
}

//KN: Used in verify(), to find the specified element within the window.
/*KN: The .split function will take a string and split it into an array, with elements being the contents between the key.  example:
	var str="Hello this is my program";
	var n=str.split(" ");
	The elements of the array n will be "Hello", "this", "is", "my", and "program".
	
	So with the url "who=teacher&parentHunt=0", first split('&') will create the strings "who=teacher" and "parentHunt=0"
	Then split('=') will create the strings "who" and "teacher", and "parentHunt" and "0"
*/
function getQueryVariable(variable) {
    var query = window.location.search.substring(1); 	//KN: Takes the url (which contains the 'who' and 'parentHunt') and puts it into a string
    var vars = query.split('&'); 						//KN: Separates the string into an array of strings at the &s (see above note)
    for (var i = 0; i < vars.length; i++) { 
        var pair = vars[i].split('='); 					//KN: Separates each of those new strings at the =s (see above note)
        if (decodeURIComponent(pair[0]) == variable) { 	//KN: (Unsure) If the first piece of the pair (e.g. "who") is the variable that was sent to this function
            return decodeURIComponent(pair[1]);			//KN: ...Then, return the other piece (e.g. "teacher")
        }
    }
    console.log('Query variable %s not found', variable);	//KN: Else, if none of those elements were the desired ones, the variable couldn't be found.
}