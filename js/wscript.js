 /*
 * Common scripts needed
 * handles ajax
 * handles selection of a hunt activity
 * verifies all the form data
 * submits the form data and image data to server
 */
/* KN

Contains a function that checks student Activity submission validity, and another that initializes the map when a student selects a hunt.
*/
 
var hunts;
var multiple;

//KN: QUESTION: The only time this gets called (in user.html), is with an ajax call, with no parameters. What gets passed as x? Is it whatever gets echoed from the php file?
//KN: The parameter x is what's echoed from getHunts.php, the array called temp. If the logged-in user is student, then x[0] is the student info, x[1] is the list of hunts they can submit to, x[2] is the form for creating an activity. IF they are logged in as a teacher, x[0] is their name, and x[1] is their list of hunts.
function wscript_init(x) {                                                             
	hunts = JSON.parse(x);
	student=JSON.parse(hunts[0]); 
	$('username').innerHTML=student.firstname;
	multiple=hunts[2]; 
	hunts=hunts[1]; 
	
	if(student.parentHunt==0){	//KN: If there isn't a selected hunt, add all of the hunts from the JSON string passed, and add them to the dropdown list of hunts.
		sessionStorage.hunts=JSON.stringify(hunts);
		for ( x = 0; x < hunts.length; x++)
			$('selecthunt').options[$('selecthunt').options.length] = new Option(hunts[x]['title'], hunts[x]["id"]);	
	} else{
		for ( x = 0; x < hunts.length; x++)
			if(student.parentHunt==hunts[x].id){
				$('selecthunt').options[$('selecthunt').options.length] = new Option(hunts[x]['title'], hunts[x]["id"]); //KN: Add all of the hunts from the database to the select list
				sessionStorage.hunts=JSON.stringify(new Array(hunts[x])); 
				document.getElementById("selecthunt").value=document.getElementById("selecthunt").options[1].value; //KN: Choose the first hunt from the select list
				document.getElementById("selecthunt").style.display="none"; //KN: And hide the list
				// We still want hunts to work as an array so that way teachers/students with more than one hunt still have access to all of their hunts.
				var hunt=hunts[x]
				hunts=new Array();
				hunts[0]=hunt;
				createStudentActivityList();
				return;
			}
	}
		
}
var uniq=Math.floor((Math.random()*100)+1);
//shortcut to get object with their id
function $(x) {return document.getElementById(x);}

//this function invoked when student selects a hunt
//KN: It will fill the map boundaries, get the teacher's additional questions, and initialize the file API.
function huntselection(x) 
{ 

	if(typeof(Storage)!=="undefined"){
		sessionStorage.isEdit=false; //KN: Note if sessionstorage can't be used.
	} else{
		// TODO: How to deal with user not supporting storage.
	}
	// When the user selects the null select, it will no longer even attempt to load activities.
	if ((x = document.getElementById("selecthunt").selectedIndex-1) >= 0) { //KN: selectedIndex is the item's order within the <select> </select> field. 0 is the first (so that would be the "Select" text, not a real value). So if the selected text is NOT the first one (ie, is a real hunt), then continue. 
		//KN: QUESTION: Why are we setting x to something, when that was a variable passed to this function?  
		var hunt=hunts[x]; //KN: set hunt equal to the specified hunt
		huntboundary=new google.maps.LatLngBounds(new google.maps.LatLng(hunt['minlat'],hunt['minlng']),new google.maps.LatLng(hunt['maxlat'],hunt['maxlng'])); //KN: Draw the map boundaries
		$('activity').innerHTML=multiple; //KN: "multiple" is given value in wscript_init //KN: QUESTION: See my question in wscript_init
		// Pass "" as parameter because there are no answers to the question.
		displayAdditionalQuestions("");
		starter();
	}
}
//has the boundary information of selected hunt
var huntboundary;

//checks for validity of data and submits the information through ajax. Invoked when student submits the form.
//KN: ("the form" is the Activity creation form for a hunt)
function check(form)
{
	console.log(morc);
	var contents={};
	var x = document.getElementsByName('answer'); //KN: 'answer' are the radio boxes for the students' multiple choice questions. Checked means the correct choice.
	for (var i = 0; i < x.length; i++) {
		if (x[i].checked) { 
			contents['answer'] = x[i].value; //KN: Put the correct answer into the array (which will eventually get uploaded)
			break;
		}
	}
	var y=new Array("textarea","text","number"); //KN: This is like y[1]="textarea", y[2]="text", ...
	for(var i = 0; i < form.length; i++) {	
		if (y.indexOf(form[i].type)!=-1)	//KN: Go through the passed form. Check the elements' types against the elements in y. If the given element is of one of those 3 types...
			contents[form[i].name] = form[i].value;	//KN: Then put the contents from that form into the array (which will eventually get uploaded)
	} 	//KN: The above section is important because otherwise you would be uploading unnecessary elements, like the teacher's questions.
	
	if (morc && morc.verify()) { //KN: QUESTION: This verifies the login credentials again right?
		contents['media'] = morc; 
		contents['huntid'] = document.getElementById("selecthunt").value;
		contents['lat']= morc.loc.lat();
		contents['lng']=morc.loc.lng();
		// Checks to make sure that all of the required attribute are filled in.
		if(contents.aboutmedia && contents.a && contents.b && contents.howhelpful && contents.mquestion && contents.yourdoubt){ //KN: QUESTION: It's checking if the elements are included. I can find a, b, and mquestion. But not aboutmedia, howhelpful, or yourdoubt, in any files.
			contents.status="Unverified";
		} else{ //KN: If any of those elements are missing from the submission, then don't accept it.
			contents.status="Incomplete";
		}
		// If the url does not start with http:// add http:// to the start.  This makes it so that when the page is linked to, it doesn't look for the page
		// on the ouyangdev server.
		if(contents.interesting_url!="" && contents.interesting_url.indexOf("http://")==-1) contents.interesting_url= "http://" + contents.interesting_url;
		
		contents = JSON.stringify(contents);
		// The encodeURIComponent enables the use of special characters such as & to be sent in the string contents.
		// PHP automatically decodes the post data, so no changes need to be made in php code.
		contents = "content="+ encodeURIComponent(contents);
		ajax(contents, GLOBALS.PHP_FOLDER_LOCATION + "user_upload.php", function(x) {
			if (x == "true")
				window.location.reload();
			else
				alert("An error has occured while attempting to upload your file.");
		});
	}
	return false;
}
