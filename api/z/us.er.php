<?php
/* file: api/z/us.er.php 
Handle: aj */
require_once 'cls.company.php'; //this is for session checking company file and returning id,cid,passport and system mode and slim instance

class Users extends company {
	
	private $sMod = 'aj'; //this is for passing module name in url
	function __construct() {
		parent::__construct('1', $this->sMod); //this calls  cls.company  constructor
	}

	function init($app) { // define routes
		$this->amIin($this->sMod); // if return message from company with login error, then it will go to login page
	  	$app->get('/z/us/er', array($this, 'getUsers'));//getusers
		$app->post('/z/us/er', array($this, 'saveUser'));//save user
		$app->post('/z/us/er/Comunities', array($this, 'saveCommunity')); //users assignes coommunities
		$app->post('/z/us/er/Comunities/delCommMem', array($this,'delCommMem'));//delete community user
		$app->put('/z/us/er/:id', array($this, 'updateUser'));//update user
		$app->delete('/z/us/er/:id', array($this,'deleteuser'));//delete user
		$app->get('/z/us/er/:id', array($this, 'getUser'));//get user
		$app->get('/z/us/er/packages/:id', array($this, 'getPackages'));
		$app->get('/z/us/er/modules/:id', array($this, 'getModules'));
		$app->get('/z/us/er/cComunities/:id', array($this, 'getClientComm')); //clentcommunities
		$app->get('/z/us/er/Comunities/:id', array($this, 'getCommunities')); //users assignes coommunities
	
		$app->run();
	}

	function getUsers() { 
		$userData = array();
		$usersRole = json_decode($this->sM)->packages;
		$sysAdmin = false;
		$whereCon ='';

		try {
			if(isset($usersRole) && count($usersRole) > 0) {
				foreach($usersRole as $key => $value) {
					if($value->id == 1 && $value->role =='Administrator') { //spp.System package
						$sysAdmin=true;
					}
				}
			}

			if ($sysAdmin && $this->iC == 1) { //spp.System package
				$whereCon ='';
			} else if ($sysAdmin && $this->iC!=1) { // client
				$whereCon ='AND u.idClient = '.$this->iC;
			} else if (!$sysAdmin && $this->iC!=1) { //only logged user
				$whereCon ='AND u.idUser = '.$this->iU;
			}

			$sqlClient = "	SELECT u.idUser as idUser, u.username as username, u.emailAddress as emailAddress, u.nameFirst as nameFirst, u.nameLast as nameLast, u.avatar as avatar, date_format(u.created,'%d/%m/%Y %H:%i') as created, date_format(u.lastAccess,'%d/%m/%Y %H:%i') as lastAccess ,up.role as role, u.status as status, u.language as language 
							FROM user u, userPrivilege up 
							WHERE u.idUser=up.idUser ".$whereCon." 
								AND u.status>8
							GROUP BY up.idUser"; //need one record for user. we ca get modules nd packages induvidually when click on modules or packages in front page

			$db = $this->DbCon();//get db connection from controller extends company
			$stmt = $db->prepare($sqlClient);
			$stmt->execute();
			$users = $stmt->fetchAll(PDO::FETCH_ASSOC);	
			$userData['success'] = true;
			$userData['data'] =$users;
			echo json_encode($userData);
		} catch (PDOException $e) {						
			echo '{"success":false,"error":{"code":"200", message":'.$e->getMessage() .'}}';
		}
		
	}
	
	function getUser($id) { 

		$userData =  new stdClass();
		/*$sql = "SELECT u.idUser as idUser, u.username as Username, u.emailAddress as emailAddress, u.nameFirst as nameFirst, u.nameLast as nameLast, date_format(u.created,'%d/%m/%Y %H:%i') as created, date_format(u.lastAccess,'%d/%m/%Y %H:%i') as lastAccess ,up.role as role, u.status as status from user u, userPrivilege up where u.idUser=up.idUser AND idUser= :id";*/
		$sql ="	SELECT u.idUser as idUser, u.username as username, u.emailAddress as emailAddress, u.nameFirst as nameFirst, u.nameLast as nameLast, u.avatar as avatar, date_format(u.created,'%d/%m/%Y %H:%i') as created, date_format(u.lastAccess,'%d/%m/%Y %H:%i') as lastAccess ,up.role as role, u.language as language, u.status as status from user u, userPrivilege up 
				WHERE u.idUser=up.idUser 
					AND u.idUser= :id 
					AND  u.status>8  
				GROUP BY u.idUser";

		try {
			$db = $this->DbCon();//get db connection from controller extends company
			$stmt = $db->prepare($sql);
			$stmt->bindParam("id", $id); //this is returned from sys.company.php file
			$stmt->execute();
			$users = $stmt->fetch(PDO::FETCH_OBJ);	
			$userData->success = true;
			$userData->data =$users;					
			echo json_encode($userData);
		} catch (PDOException $e) {						
			echo '{"success":false,"error":{"code":"200", message":'. $e->getMessage() .'}}';
		}
	}	

	function deleteuser($id) { // save new COmmunity
		$request   = Slim::getInstance()->request();
		$userDelete = json_decode($request->getBody());
		$userData = array();
		$sUserDel = " 	UPDATE user SET status = 1 WHERE idUser	= :uId"; 
		//status 8 means unauthorized, client admin will authorize community
		$sUserPrDel = " DELETE FROM userPrivilege WHERE idUser = :uId"; 
		
		try {
			$db = $this->DbCon();//get db connection from controller extends company

	  		$stmt = $db->prepare($sUserDel);
			$stmt->bindParam("uId", $id);
			$stmt->execute();
			
			$stmtp = $db->prepare($sUserPrDel);
			$stmtp->bindParam("uId", $id);			
			$stmtp->execute();
			
			$userData['success'] = true;
			$descB = "Deleted User "; //for brief description about transaction (len 20 varchar)
			$descD = "User Deleted"; //for Details description about transaction (len 255 varchar)
			$data = json_encode($userDelete);
			//userid,clientid, tablepkey,tablename,module name(handle),action,description brief,escription detail,data(json data)
			$this->logActivity($db, $this->iU, $this->iC, $id, 'user', $this->sMod,'D', $descB, $descD, $data); //call storeprocedure function in company file for adding activity trail

			$db = null;
			echo json_encode($userData);
		} catch (PDOException $e) {
			echo '{"success":false,"error":{"code":"200", message":'. $e->getMessage() .'}}';
		}
	}

	function updateUser($id) {
		$request   = Slim::getInstance()->request();
		$body 	   = $request->getBody();
		$userDelete = json_decode($body);

		/*$testdata = '{
					    "idUser": 4,
					    "username": "venkata",
					    "emailAddress": "venkata.chalasani@company.co.uk",
					    "nameFirst": "ventest",
					    "nameLast": "testven",
					    "language": "en",
					    "role": "Administrator"
					} ';
		$userDelete = json_decode($testdata);*/
		$userData = array();

		$sql = "UPDATE user SET nameFirst = :nameFirst ,nameLast = :nameLast, avatar = :avatar, username = :username, language = :language
				WHERE idUser = :idUser AND status > 1";

		// This needs more validation. What if password value is ""?
		// password = :password
		// $password = hash('md5', $userDelete->password);

		try {
			$db = $this->DbCon();//get db connection from controller extends company
			$stmt = $db->prepare($sql);
			$stmt->bindParam("nameFirst", $userDelete->nameFirst);
			$stmt->bindParam("nameLast", $userDelete->nameLast);
			$stmt->bindParam("username", $userDelete->username);
			$stmt->bindParam("avatar", $userDelete->avatar);
			$stmt->bindParam("language", $userDelete->language);  
			$stmt->bindParam("idUser", $id); //this is returned from sys.company.php file		
			// $stmt->bindParam("password", $password);
			$stmt->execute();

			$userData['success'] = true;
			$userData['data'] = $userDelete;
			
			$descB = "User Updated "; //for brief description about transaction about 20 varchar
			$descD = "System Admin Updated  User"; //for Details description about transaction about 255 varchar
			$data = json_encode($userDelete);
			//userid,clientid, tablepkey,tablename,module name(handle),action,description brief,escription detail,data(json data)
			$this->logActivity($db, $this->iU, $this->iC, $id, 'user', $this->sMod,'U', $descB, $descD, $data); //call storeprocedure function in company file for adding activity trail

			$db = null;
			echo json_encode($userData); 
		} catch (PDOException $e) {
			echo '{"success":false,"error":{"code":"200", message":'. $e->getMessage() .'}}';
		}
	}

	function saveUser() {
		$request   = Slim::getInstance()->request();
		$body 	   = $request->getBody();
		$userDelete = json_decode($body);

		/*$testdata = '{
					    "username": "venkata2",
					    "emailAddress": "venkata2.chalasani@company.co.uk",
					    "nameFirst": "ventest",
					    "nameLast": "testven",
					    "language": "en",
					    "role": "Administrator",
					    "password": "venkata",
					    "idClient" : "2"
					} ';
		$userSave = json_decode($testdata);*/

		$userData = array();
		$sqlChk = "	SELECT * FROM user WHERE (username=:userNme OR emailAddress= :emailA) AND status >8 ";
		$sql = " INSERT INTO user(username, emailAddress, password, nameFirst, nameLast, avatar, language, status, created) 
				 VALUES(:userNme, :emailA, :pwd, :nameFirst, :nameLast, :avatar, :language, '9', now())";

		try {
			$db = $this->DbCon();//get db connection from controller extends company
			$stmtC = $db->prepare($sqlChk);
			$stmtC->bindParam("userNme", $userSave->username);
			$stmtC->bindParam("emailA", $userSave->emailAddress); 
			$stmtC->execute();
			$eXistedUrs = $stmtC->fetchAll(PDO::FETCH_ASSOC);	
	
			if(count($eXistedUrs) == 0){
				$stmt = $db->prepare($sql);
				$pwd = md5($userSave->password);
				$stmt->bindParam("userNme", $userSave->username);
				$stmt->bindParam("emailA", $userSave->emailAddress); 
				$stmt->bindParam("nameFirst", $userSave->nameFirst);
				$stmt->bindParam("nameLast", $userSave->nameLast);
				$stmt->bindParam("avatar", $userSave->avatar); 
				$stmt->bindParam("pwd", $pwd); 
				$stmt->bindParam("idClient", $userSave->idClient); 
				$stmt->bindParam("language", $userSave->language); 

				$stmt->execute();
				//$community->idCommunity = $db->lastInsertId();
				$userSave->idUser = $db->lastInsertId();

				$userData['success'] = true;
				$userData['data'] = $userSave;
				
				$descB = "User Updated "; //for brief description about transaction about 20 varchar
				$descD = "System Admin Updated  User"; //for Details description about transaction about 255 varchar
				$data = json_encode($userSave);
				//userid,clientid, tablepkey,tablename,module name(handle),action,description brief,escription detail,data(json data)
				$this->logActivity($db, $this->iU, $this->iC, $userSave->idUser, 'user', $this->sMod,'I', $descB, $descD, $data); //call storeprocedure function in company file for adding activity trail
				echo json_encode($userData); 
			} else {
				echo '{"success":false,"error":{"code":"200", message":"User Already Exists"}}';
			}		
			$db = null;			
		} catch (PDOException $e) {
			echo '{"success":false,"error":{"code":"200", message":'. $e->getMessage() .'}}';
		}
	}

	function getPackages($uId) { //get packages

		$sSql = "	SELECT p.id AS id, p.name AS name, p.description AS description, DATE_FORMAT( p.created,  '%d/%m/%Y %H:%i' ) AS created,up.role as role,p.logo as logo
					FROM userPrivilege up, package p 
					WHERE p.id = up.idPackage
						AND up.idUser = :Uid"; // AND up.status > 8

		$userPackages = array();
		try {
			$rDb = $this->DbCon(); //get db connection from controller extends company
			$rStmt = $rDb->prepare($sSql);
			$rStmt->bindParam("Uid", $uId); 
			$rStmt->execute();
			$apackages = $rStmt->fetchAll(PDO::FETCH_ASSOC);
			$userPackages['success'] = true;
			$userPackages['data'] =$apackages;
			$rDb = null;
			echo(json_encode($userPackages));
		} catch(PDOException $e) {
			echo '{"success":false,"error":{"code":"200", message":'. $e->getMessage() .'}}';
		}
	}// KP: Arent packages and modules requested together? couldnt we combine the two functions in one api call?

	function getModules($uId) {
		$sSql = " 	SELECT m.id AS id, m.handle AS handle, m.description AS description, m.name AS name, 
					DATE_FORMAT( m.created,  '%d/%m/%Y %H:%i' ) AS created
					FROM userPrivilege p LEFT JOIN module m ON m.idPackage = p.idPackage
					WHERE p.idUser = :Uid AND m.status > 8"; // AND  p.status > 8
		$userModules = array();

		try {
			$rDb = $this->DbCon(); //get db connection from controller extends company
			$rStmt = $rDb->prepare($sSql);
			$rStmt->bindParam("Uid", $uId); 
			$rStmt->execute();
			$aModules = $rStmt->fetchAll(PDO::FETCH_ASSOC);
			$userModules['success'] = true;
			$userModules['data'] =$aModules;
			$rDb = null;
			echo(json_encode($userModules));
		} catch (PDOException $e) {
			echo '{"success":false,"error":{"code":"200", message":'. $e->getMessage() .'}}';
		}
	}
	function getClientComm($uId) { //get client communities
		$sSql = " 	SELECT cm.name AS name, cm.id AS id, cm.visibility AS visibility, DATE_FORMAT( cm.created,  '%d/%m/%Y %H:%i' ) AS created, c.name AS nameClient, c.passport as passport 
					FROM community cm, client c, user u
					WHERE u.idUser =:Uid
						AND u.idClient = c.idClient
						AND u.idClient = cm.idClient 
						AND cm.status >8 
						AND cm.status <10 
						AND c.status >8 
						AND u.status >8";
		$userCommunities = array();

		try {
			$rDb = $this->DbCon(); //get db connection from controller extends company
			$rStmt = $rDb->prepare($sSql);
			$rStmt->bindParam("Uid", $uId); 
			$rStmt->execute();
			$aCommunities = $rStmt->fetchAll(PDO::FETCH_ASSOC);
			$userCommunities['success'] = true;
			$userCommunities['data'] =$aCommunities;
			$rDb = null;
			echo(json_encode($userCommunities));
		} catch (PDOException $e) {
			echo '{"success":false,"error":{"code":"200", message":'. $e->getMessage() .'}}';
		}
	}

	function getCommunities($uId) { //get client communities
		$sSql = " 	SELECT cm.name AS name, cm.id AS id, cm.visibility AS visibility, DATE_FORMAT( cm.created,  '%d/%m/%Y %H:%i' ) AS created, c.name AS nameClient, c.passport AS passport
					FROM community cm, client c, communityMember cem
					WHERE cem.idUser = :Uid
						AND cm.id = cem.idCommunity
						AND cm.idClient = c.idClient 
						AND cm.status >8 
						AND cm.status <10 
						AND c.status >8 
						AND cem.status >8";
		$userCommunities = array();

		try {
			$rDb = $this->DbCon(); //get db connection from controller extends company
			$rStmt = $rDb->prepare($sSql);
			$rStmt->bindParam("Uid", $uId); 
			$rStmt->execute();
			$aCommunities = $rStmt->fetchAll(PDO::FETCH_ASSOC);
			$userCommunities['success'] = true;
			$userCommunities['data'] =$aCommunities;
			$rDb = null;
			echo(json_encode($userCommunities));
		} catch (PDOException $e) {
			echo '{"success":false,"error":{"code":"200", message":'. $e->getMessage() .'}}';
		}
	}

	function saveCommunity() {
		$usertoCOmmunity = $_POST;
	    $userData = array();
	    $sql_comm_add = " INSERT INTO communityMember(idCommunity, idUser, created) values(:idCommunity, :idUser, now())"; 
		try {
			$db = $this->DbCon();
			$dulicateCM = $this->getUserCheck($usertoCOmmunity['id'], $usertoCOmmunity['idUser']); //check user already exitsts or not
			if(empty($dulicateCM) == true) {
				$stmt = $db->prepare($sql_comm_add);
				$stmt->bindParam("idUser", $usertoCOmmunity['idUser']);
				$stmt->bindParam("idCommunity", $usertoCOmmunity['id']);
				$stmt->execute();
				$descB = "Community Member"; //for brief description about transaction (len 20 varchar)
				$descD = "Added Community Member to Community"; //for Details description about transaction (len 255 varchar)
				$data = json_encode($usertoCOmmunity);
				//userid,clientid, tablepkey,tablename,module name(handle),action,description brief,escription detail,data(json data)
				$this->logActivity($db, $this->iU, $this->iC, $usertoCOmmunity['id'].'|'.$usertoCOmmunity['idUser'], 'communityMember', $this->sMod,'I', $descB, $descD, $data); //call storeprocedure function in company file for adding activity trail
				$userData['success'] = true;
				$userData['data'] = $usertoCOmmunity;
				echo json_encode($userData);

			} else {				
				echo '{"success":false,"error":{"code":"200", message":"User already exists in this Community"}}';			
			}			
			$db = null;
		} catch (PDOException $e) {
			echo '{"success":false,"error":{"code":"200", message":'. $e->getMessage() .'}}';
		}
    }

	function delCommMem() { // delete Community Member
		/*$testdata = '{  "id": "374",
			               "idUser":188 } ';
	    $usertoCOmmunity = json_decode($testdata);*/
	    $userData = array();
		$sql = " UPDATE communityMember 
				 SET status = 1 
				 WHERE idCommunity = :idCommunity 
					AND idUser = :idUser AND (status!=1 && status!=10)"; //Delete means update status to 1 
		try {
			$db   = $this->DbCon(); //databse connection
			$stmt = $db->prepare($sql);  
			$stmt->bindParam("idCommunity", $_POST['id']);
			$stmt->bindParam("idUser", $_POST['idUser']);
			$stmt->execute(); //execute Query
			
			$descB = "Community Member"; //for brief description about transaction (len 20 varchar)
			$descD = "Deleted Community Member of Community"; //for Details description about transaction (len 255 varchar)
			$data = json_encode($_POST);
			//userid,clientid, tablepkey,tablename,module name(handle),action,description brief,escription detail,data(json data)
			$this->logActivity($db, $this->iU, $this->iC, $_POST['id'].'|'.$_POST['idUser'], 'communityMember', $this->sMod,'D', $descB, $descD, $data); //call storeprocedure function in company file for adding activity trail

			$db = null;
			$userData['success'] = true;
			$userData['data'] = $_POST;
			echo json_encode($userData);
		} catch (PDOException $e) {
			echo '{"success":false,"error":{"text":'. $e->getMessage() .'}}'; 
		}
	}

	function getUserCheck($idCommunity,$idUser) {
		$sql_check = " 	SELECT idCommunity,idUser,status from communityMember 
						WHERE idCommunity = :idCommunity 
							AND idUser = :idUser AND status > 8 "; //seelct user exists in that particular community
		$db = $this->DbCon();
		$stmtc = $db->prepare($sql_check);
		$stmtc->bindParam("idUser", $idUser);
		$stmtc->bindParam("idCommunity", $idCommunity);
		$stmtc->execute();
		$dulicateCMa = $stmtc->fetch(PDO::FETCH_OBJ) ;
		if ($stmtc->rowCount() == 0) $dulicateCM = 0;
		else $dulicateCM = $dulicateCMa; //if user not exists return 0 else return  that row
	    return $dulicateCM;
	}

}
new Users(); //creating object for comunity class

?>