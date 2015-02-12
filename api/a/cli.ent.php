<?php
/*  File: api/a/cli.ent.php 
		Handle: ag
		Author: MI
*/
require_once 'z/cls.company.php'; // This is for session checking company file and returning id,cid,passport and system mode and slim instance

class Client extends company {
	private $sMod = 'ag'; // This is for passing module name in url
	function __construct() {
		parent::__construct('1', $this->sMod); //this calls  cls.company  constructor
	}

	function init($app) { // define routes
		$this->amIin($this->sMod); 
		// if return message from company with login error, then it will go to login page
	  $app->get('/a/cli/ent', array($this, 'getClients'));
		$app->get('/a/cli/ent/:id', array($this, 'getClient'));
		$app->get('/a/cli/ent/search/:query', array($this, 'findByName'));
		$app->post('/a/cli/ent', array($this,'addClient'));
		$app->put('/a/cli/ent', array($this, 'updateClient'));
		$app->delete('/a/cli/ent', array($this,'deleteClient'));
		$app->run();
	}

	function getClients() { 

		$sSql = " SELECT c.idClient, c.Name, c.Passport, c.Created, c.SubDomain, u.emailAddress 
							FROM client c, user u, userPrivilege up
				  		WHERE c.idClient = u.idClient AND u.idUser = up.idUser 
				 			AND up.idPackage =1 
				 			AND up.role = 'Administrator'
				 			AND c.status > 8  
				  		ORDER BY c.name ";
		try {
			$rDb = $this->DbCon(); // Get db connection from controller extends company
			$rStmt = $rDb->query($sSql);  
			$aClients = $rStmt->fetchAll(PDO::FETCH_OBJ);
			$rDb = null;
			echo json_encode($aClients);
		} catch(PDOException $e) {
			echo '{"error":{"text":'. $e->getMessage() .'}}'; 
		}
	}

	function getClient($iId) {
		$sSql = " SELECT c.Name, c.idClient, c.Passport, c.Created, c.SubDomain, u.emailAddress 
							FROM client c, user u, userPrivilege up
				  		WHERE c.idClient = u.idClient 
				  		AND u.idUser = up.idUser 
				  		AND up.idPackage =1 
				  		AND up.role = 'Administrator'
				  		AND c.status > 8 
				  		AND c.passport = :id";
		try {
			$rDb = $this->DbCon(); //get db connection from controller extends company
			$rStmt = $rDb->prepare($sSql);  
			$rStmt->execute(array(
				":id"=>$iId
			));
			$oClient = $rStmt->fetchObject();  
			$rDb = null;
			echo json_encode($oClient); 
		} catch(PDOException $e) {
			echo '{"error":{"text":'. $e->getMessage() .'}}'; 
		}
	}

	function addClient() {
		$rRequest = Slim::getInstance()->request();
		$oClient = json_decode($rRequest->getBody());

		try {
			$sSql = "INSERT INTO client (name, passport, created, subDomain)
							SELECT :Name, (max(passport)+1), NOW(), :subDomain 			
							FROM client";
			$rDb = $this->DbCon(); //get db connection from controller extends company
			$rStmt = $rDb->prepare($sSql);
			$rStmt->execute(array(
				":Name"=>$oClient->Name,
				":subDomain"=>$oClient->SubDomain
			));
			//	Inserting into the community, user and user priviledge tables
			$idClient = $rDb->lastInsertId();								
			$sSql	=	"INSERT INTO community (idClient, name, status, created) 
							VALUES ($idClient, 'All', 9, NOW());
							INSERT INTO user (idClient, username, emailAddress, status, created)
							VALUES ($idClient, :username, :emailAddress, 8, NOW());
							SET @idUser = LAST_INSERT_ID();
							INSERT INTO userPrivilege (idUser, idPackage, role, created)
							VALUES (@idUser, 1, 'Administrator', NOW());";
			$rStmt = $rDb->prepare($sSql);
			$rStmt->bindParam(':username', $oClient->username);
			$rStmt->bindParam(':emailAddress', $oClient->emailAddress);
			$rStmt->execute();
			//	Querying the client table to retrieve the inserted passport
			$sSql	=	"SELECT Passport 
							FROM client
							WHERE idClient = $idClient 
				  		AND status > 8";
			$rStmt = $rDb->prepare($sSql);
			$rStmt->execute(); 		
			$oPassport=$rStmt->fetch(PDO::FETCH_OBJ);	//	Fetch Passport value
			$oClient->Passport=$oPassport->Passport;	//	Return same passport value to add to the model

			//	Creating a new Message Function that sends email confirmation to the newly creaeed client.
			$oMsgDetails= array();	//	New emty class that will contain all the email header information

			$sMessage = "You have been requested to join the {$this->sSname}! <br>".
									"To activate your account please visit: http://".$_SERVER['SERVER_NAME']."/z/regis/ter/{$oClient->username}";
			$oMsgDetails[0]['to'] = $oClient->emailAddress;
			$oMsgDetails[0]['subj'] = "{$this->sSname} Registration";
			$oMsgDetails[0]['msg'] = $sMessage;
			$this->cNotify((object) $oMsgDetails, 'mail');
			$rDb = null;	
			echo json_encode($oClient);
		} catch(PDOException $e) {
			echo '{"error":{"text":'. $e->getMessage() .'}}';
		}
	}

	function updateClient() {
		$rRequest = Slim::getInstance()->request();
		$oClient = json_decode($rRequest->getBody());

		$sSql = "UPDATE client 
						SET name = :Name, subDomain = :SubDomain 
						WHERE passport = :Passport 
						AND idClient = :idClient";
		try {
			$rDb = $this->DbCon(); //get db connection from controller extends company
			$rStmt = $rDb->prepare($sSql);
			$rStmt->bindParam("Name", $oClient->Name);
			$rStmt->bindParam("Passport", $oClient->Passport);
			$rStmt->bindParam("idClient", $oClient->idClient);
			$rStmt->bindParam("SubDomain", $oClient->SubDomain);
			$rStmt->execute();

			//	For adding the update transaction into the log
			$descB = "Client Updated "; //for brief description about transaction (len 20 varchar)
			$descD = "Client ".$oClient->Name." Changed"; //for Details description about transaction (len 255 varchar)
			$data = json_encode($oClient);
			//userid,clientid, tablepkey,tablename,module name(handle),action,description brief,escription detail,data(json data)
			$this->logActivity($rDb, $this->iU, $this->iC, $this->iC, 'client', $this->sMod,'U', $descB, $descD, $data); //call storeprocedure function in company file for adding activity trail
			$rDb = null;
			echo json_encode($oClient); 
		} catch(PDOException $e) {
			echo '{"error":{"text":'. $e->getMessage() .'}}'; 
		}
	}

	function deleteClient() {
		$rRequest = Slim::getInstance()->request();
		$oClient = json_decode($rRequest->getBody());

		$sSql = "UPDATE client SET Status = '1' WHERE passport = :passport";
		try {
			$rDb = $this->DbCon(); //get db connection from controller extends company
			$rStmt = $rDb->prepare($sSql);  
			$rStmt->execute(array(
				":passport"=>$oClient->Passport
			));
			//	Logging the delete operation
			$descB = "Client Deleted "; //for brief description about transaction (len 20 varchar)
			$descD = "Client Deleted"; //for Details description about transaction (len 255 varchar)
			$data = json_encode($oClient);
			//userid,clientid, tablepkey,tablename,module name(handle),action,description brief,escription detail,data(json data)
			$this->logActivity($rDb, $this->iU, $this->iC, $this->iC, 'client', $this->sMod,'D', $descB, $descD, $data); //call storeprocedure function in company file for adding activity trail
			$rDb = null;
			echo json_encode($oClient);	//	Prevents the client from reading the remove function as a failure.
		} catch(PDOException $e) {
			echo '{"error":{"text":'. $e->getMessage() .'}}'; 
		}
	}

	function findByName($sQuery) {
		$sSql = "SELECT * FROM client WHERE UPPER(Name) AND status>8 LIKE :query ORDER BY name";
		try {
			$rDb = $this->DbCon(); //get db connection from controller extends company
			$rStmt = $rDb->prepare($sSql);
			$sQuery = "%".$sQuery."%";
			$rStmt->bindParam("query", $sQuery);
			$rStmt->execute();
			$oClients = $rStmt->fetchAll(PDO::FETCH_OBJ);
			$rDb = null;
			echo json_encode($oClients);
		} catch(PDOException $e) {
			echo '{"error":{"text":'. $e->getMessage() .'}}'; 
		}
	}
}
new Client(); //creating object for Cleint class
?>