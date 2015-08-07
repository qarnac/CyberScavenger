 /*
 * Common scripts needed
 * handles ajax
 * handles selection of a hunt activity
 * verifies all the form data
 * submits the form data and image data to server
 */

 
var hunts;
var multiple;
function wscript_init(x) {                                                             
	hunts = JSON.parse(x);
	student=JSON.parse(hunts[0]);
	$('username').innerHTML=student.firstname;
	multiple=hunts[2];
	hunts=hunts[1];
	
	if(student.parentHunt==0){
		sessionStorage.hunts=JSON.stringify(hunts);
		for ( x = 0; x < hunts.length; x++)
			$('selecthunt').options[$('selecthunt').options.length] = new Option(hunts[x]['title'], hunts[x]["id"]);	
	} else{
		for ( x = 0; x < hunts.length; x++)
			if(student.parentHunt==hunts[x].id){
				$('selecthunt').options[$('selecthunt').options.length] = new Option(hunts[x]['title'], hunts[x]["id"]);
				sessionStorage.hunts=JSON.stringify(new Array(hunts[x]));
				document.getElementById("selecthunt").value=document.getElementById("selecthunt").options[1].value;
				document.getElementById("selecthunt").style.display="none";
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
function huntselection(x)
{ 

	if(typeof(Storage)!=="undefined"){
		sessionStorage.isEdit=false;
	} else{
		// TODO: How to deal with user not supporting storage.
	}
	// When the user selects the null select, it will no longer even attempt to load activities.
	if ((x = document.getElementById("selecthunt").selectedIndex-1) >= 0) {
		var hunt=hunts[x];
		huntboundary=new google.maps.LatLngBounds(new google.maps.LatLng(hunt['minlat'],hunt['minlng']),new google.maps.LatLng(hunt['maxlat'],hunt['maxlng']));
		$('activity').innerHTML=multiple;
		// Pass "" as parameter because there are no answers to the question.
		displayAdditionalQuestions("");
		starter();
	}
}
//has the boundary information of selected hunt
var huntboundary;
//invoked when student submits the form .checks for validity of data and submits the information through ajax
function check(form)
{
	console.log(morc);
	var contents={};
	var x = document.getElementsByName('answer');
	for (var i = 0; i < x.length; i++) {
		if (x[i].checked) {
			contents['answer'] = x[i].value;
			break;
		}
	}
	var y=new Array("textarea","text","number");
	for(var i = 0; i < form.length; i++) {
		if (y.indexOf(form[i].type)!=-1)
			contents[form[i].name] = form[i].value;
	}
	if (morc && morc.verify()) {
		contents['media'] = morc;
		contents['huntid'] = document.getElementById("selecthunt").value;
		contents['lat']= morc.loc.lat();
		contents['lng']=morc.loc.lng();
		// Checks to make sure that all of the required attribute are filled in.
		if(contents.aboutmedia && contents.a && contents.b && contents.howhelpful && contents.mquestion && contents.yourdoubt){
			contents.status="Unverified";
		} else{
			contents.status="Incomplete";
		}
		// If the url does not start with http:// add http:// to the start.  This makes it so that when the page is linked to, it doesn't look for the page
		// on the ouyangdev server.
		if(contents.interesting_url!="" && contents.interesting_url.indexOf("http://")==-1) contents.interesting_url= "http://" + contents.interesting_url;
		
		contents = JSON.stringify(contents);
		// The encodeURIComponent enables the use of special characters such as & to be sent in the string contents.
		// PHP automatically decodes the post data, so no changes need to be made in php code.
		contents = "content="+ encodeURIComponent(contents);
		var answer = document.getElementsByName('answer');
		var answer0 = document.getElementById('a');
		var answer1 = document.getElementById('b');
		var answer2 = document.getElementById('c');
		var answer3 = document.getElementById('d');
		var answer4 = document.getElementById('e');

		var answerFilled = true;
		var ischecked_method = false;
		var userFilledEverything = false;
		for ( var i = 0; i < answer.length; i++) {
    		if(answer[i].checked) {
    			if(i == 0 && answer0.value =='')
    			{
    				ischecked_method = true;
    				answerFilled = false;
    				window.alert("Please insert text in your checked option!");
    			}
    			if(i == 1 && answer1.value == '')
    			{
    				ischecked_method = true;
    				answerFilled = false;
    				window.alert("Please insert text in your checked option!");
    				}    			
    			if(i == 2 && answer2.value =='')
    			{
    				ischecked_method = true;
    				answerFilled = false;
    				window.alert("Please insert text in your checked option!");
    			}
    			if(i == 3 && answer3.value =='')
    			{
    				ischecked_method = true;
    				answerFilled = false;
    				window.alert("Please insert text in your checked option!");
    			}
    			if(i == 4 && answer4.value =='')
    			{
    				ischecked_method = true;
    				answerFilled = false;
    				window.alert("Please insert text in your checked option!"); 
    			}
    			else
    			{
    				ischecked_method = true;	
    				answerFilled = true;
    			}
        		}	
    		}
		
		var mquestion = document.getElementById("mquestion");
		if(!ischecked_method && mquestion.value != ''){ //no answer is checked and multiple question textarea is filled
    		window.alert("Please choose which one of the options will be the right answer!");
    		userFilledEverything = false;
		}
		else if(ischecked_method && mquestion.value == ''){ //no answer is checked and multiple question textarea is filled
    		window.alert("Please enter the text for your multiple choice question!");
    		userFilledEverything = false;
		}
		else if(ischecked_method && mquestion.value == '' && answerFilled){
			userFilledEverything = false;
		}
		else if(ischecked_method && mquestion.value != '' && answerFilled){
			userFilledEverything = true;
		}
		else if(!ischecked_method && mquestion.value == '' && answerFilled){
			userFilledEverything = true;
		}
		if(userFilledEverything == true){
			ajax(contents, GLOBALS.PHP_FOLDER_LOCATION + "user_upload.php", function(x) {
				if (x == "true")
					window.location.reload();
				else
					alert("An error has occured while attempting to upload your file.");
			});

		}
		
	}
	return false;
}
	
