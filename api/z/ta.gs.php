<?php
require_once 'z/cls.company.php'; //this is for session checking company file and returning id,cid,passport and system mode and slim instance
class Tags extends company {
	private $sMod = 'au'; //this is for passing module name in url
	function __construct() {
		parent::__construct('1', $this->sMod); //this calls  cls.company  constructor
	}

	function init($app) { // define routes
		$this->amIin($this->sMod); // if return message from company with login error, then it will go to login page
	  	$app->get('/z/ta/gs', array($this, 'getTags'));
		$app->run();
	}

	function getTags() {

		$sql = "SELECT * 
		FROM  tag
		WHERE status >= 8;";

		try {
			$db = $this->DbCon();//get db connection from controller extends company
			$stmt = $db->prepare($sql);
			$stmt->execute();
			$todos = $stmt->fetchAll(PDO::FETCH_OBJ);
			$db = null;
			echo json_encode($todos);
		} catch (PDOException $e) {
			echo '{"success":false,"error":{"text":'. $e->getMessage() .'}}';
		}

	}

}

new Tags(); 

?>