<?php 
header ("Content-Type:text/xml");  //php will act as a xml document to the client side
//================Database====================================
include "credentials.php";	 //dbase credentials + dbase connection

$what=$_REQUEST['q'];   //pulls quadrant id from the url

$query = "SELECT * FROM stud_activity where hunt_id=$what";
$location = mysql_query($query, $dbconnect);
$table_id = 'quadrants'; //this table has the information about all the quadrants
$query = "SELECT * FROM hunt where id=$what";
$quadrants = mysql_query($query, $dbconnect);

//=============================================================

$doc=new DOMDocument('1.0');
$root=$doc->createElement('task');	

//===== Quadrants =========
//this part creates the xml elements which does have all the required information about a quadrant
$i = 0;$who=$root;  ///$i is used to keep track of how many executions happened in while loop and also create new elements at particular value of i.
$result=mysql_fetch_array($quadrants);
while ($i < mysql_num_fields($quadrants)-1) {
   
    $meta = mysql_fetch_field($quadrants, $i);
    if (!$meta) {
        
    }
	$column=$meta->name;
	if($i==6)
	{
	$zone=$doc->createElement("zone");
	$topleft=$doc->createElement("topleft");
	$who=$topleft;	
	}
	
$element=$doc->createElement($column,$result[$column]);

$element=$who->appendChild($element);
if($i==7)
	{$topleft=$zone->appendChild($topleft);
	$who=$zone;
	}
    $i++;
}
$zone=$root->appendChild($zone);
//=================== markers ==================
$markers=$doc->createElement("markers");

$i = 0;$who=$root;

while ($result=mysql_fetch_array($location)) {
	$marker=$doc->createElement("marker");
	$marker->setAttribute('type',"question");
	
	if($result['partner_names']!=""){
		$title=$result['partner_names'];

	} else{
		$title=mysql_fetch_row(mysql_query("SELECT firstname FROM students WHERE id=$result[student_id]"));
		$title=$title[0];
	}
	
	$element=$doc->createElement("id", $result['id']);
	$element=$marker->appendChild($element);
	
	$element=$doc->createElement("title", $title);
	$element=$marker->appendChild($element);
	
	$element=$doc->createElement("synopsis","");
	$element=$marker->appendChild($element);
	
	$element=$doc->createElement("latitude",$result['lat']);
	$element=$marker->appendChild($element);
	
	$element=$doc->createElement("longitude",$result['lng']);
	$element=$marker->appendChild($element);
	
	$element=$doc->createElement("icon","http://maps.google.com/mapfiles/kml/paddle/red-circle.png");
	$element=$marker->appendChild($element);
	
	$content=$doc->createElement("content");
	$pagedir=$doc->createElement('page_dir',"./php");
	$pagedir=$content->appendChild($pagedir);
	$pages=$doc->createElement("pages");
	$id=$result['id'];
	$page=$doc->createElement("page");
		
	$element=$doc->createElement("path","multiple_choice.php?qid=$id");
	$element=$page->appendChild($element);
		
	$element=$doc->createElement("name",$title);
	$element=$page->appendChild($element);
		
	$element=$doc->createElement("status","");
	$element=$page->appendChild($element);
		
	$page=$pages->appendChild($page);

	$pages=$content->appendChild($pages);
	$content=$marker->appendChild($content);
	$marker=$markers->appendChild($marker);
}
mysql_close($dbconnect);
$markers=$root->appendChild($markers);


$root=$doc->appendChild($root);

echo $doc->saveXML();



?>