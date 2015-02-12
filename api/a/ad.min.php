<?php
/*  File: api/a/cli.ent.php 
		Handle: ag 
		Author: MI
*/
require_once 'z/cls.company.php'; // This is for session checking company file and returning id,cid,passport and system mode and slim instance

class Admin extends company {
	private $sMod = 'a1'; // This is for passing module name in url
	function __construct() {
		parent::__construct('1', $this->sMod); //this calls  cls.company  constructor
	}

	// define routes
	function init($app) { 
		$this->amIin($this->sMod); 
		// if return message from company with login error, then it will go to login page
	  $app->get('/a/ad/min', array($this, 'getTags'));
		$app->delete('/a/ad/min', array($this,'deleteTag'));
		$app->run();
	}

	function getTags() {	
		try {
			// Query to retrieve all tags used in Concept
			$sSql = "SELECT idsTag
							FROM  concept
							WHERE status > 8
							AND 	idsTag >'' ";
			$db = $this->DbCon();	// get db connection from controller extends company
			$stmt = $db->prepare($sSql);
			$stmt->execute();
			$oClient = $stmt->fetchAll(PDO::FETCH_OBJ);

			// Query to retrieve all the tags in the system specific to a client
			$sSql = "SELECT id, name
							FROM  tag
							WHERE status > 8 
							AND idClient = $this->iC
							ORDER BY id ";
			$stmt = $db->prepare($sSql);
			$stmt->execute();
			$aClient = $stmt->fetchAll(PDO::FETCH_OBJ);

			$tagsObj = Array();	// The object to be passed on to json
			$allTags = array();	// An array to contain all the times a tag id appears in the table
			foreach($oClient as $oId =>$oValue) {	// For each instance of the object
				$idTags = $oValue->idsTag; // Retrieve the idsTag value
				$pieces = explode(',', $idTags); // Explode the idsTag value and store each tag in the array
				foreach($pieces as $tag) { // For every tag, 
					array_push($allTags, $tag);	// Add the tag to the array created earlier to contain all tags
				}
			}
			// Looping through all the tags and matching each with the tags that appear on the concept table, to determine the count
			foreach($aClient as $aId => $aValue) {
				$aTag = $aValue->id;
				$a = 0; //	This wil be the variable for the count of each tag
				foreach($allTags as $oTag) {
					if ($aTag == $oTag)	{ $a++; }
				}
				$oObj = new stdClass(); // Create a new Object of stdClass, to contain the Object properties
				$oObj->id = $aTag;
				$oObj->count=$a; 
				$oObj->name = $aValue->name; 
				array_push($tagsObj, $oObj); // Pushing the object containing all the retrieved data, unto the Array Object that will be passed to json
			}
			$db = null;
			echo json_encode($tagsObj);
		} catch(PDOException $e) {
			echo '{"success":false,"error":{"text":'. $e->getMessage() .'}}';
		}
	}

	function deleteTag() {
		$rRequest = Slim::getInstance()->request();
		$oTag = json_decode($rRequest->getBody());

		$sSql = "UPDATE tag SET Status = '1' WHERE id = :id";
		try {
			$rDb = $this->DbCon(); //get db connection from controller extends company
			$rStmt = $rDb->prepare($sSql);  
			$rStmt->execute(array(
				":id"=>$oTag->id
			));
			// Logging the delete operation
			$descB = "Tag Deleted "; // for brief description about transaction (len 20 varchar)
			$descD = "Tag Deleted"; // for Details description about transaction (len 255 varchar)
			$data = json_encode($oTag);
			// userid,clientid, tablepkey,tablename,module name(handle),action,description brief,escription detail,data(json data)
			$this->logActivity($rDb, $this->iU, $this->iC, $this->iC, 'client', $this->sMod,'D', $descB, $descD, $data); // call storeprocedure function in company file for adding activity trail

			$rDb = null;
			echo json_encode($oTag); // Prevents the client from reading the remove function as a failure.
		} catch(PDOException $e) {
			echo '{"error":{"text":'. $e->getMessage() .'}}'; 
		}
	}
}
new Admin(); // creating object for Admin class
?>