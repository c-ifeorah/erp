<?php
/* File: api/z/sys.registration.php
  registration and forgot password functions 
  note: register user where status eq 8
*/
require_once('cls.company.php');

class Registration extends company {

  function __construct() {
    parent::__construct(false); // This calls  cls.company  constructor
  }

  public function saveUsers($iU, $iC) { // Update users by email id
    $rDb  = $this->DbCon();
    $rSql = $rDb-> prepare(" UPDATE user 
                            SET username= :user, 
                              password= :pas, 
                              nameFirst= :nfst, 
                              nameLast= :nlst,
                              status=9
                            WHERE emailAddress= :eAd ");
    try {
      $pas = md5(trim($_POST['pas']));
      $rSql->bindParam(':user', $_POST['usr'], PDO::PARAM_STR, 20);
      $rSql->bindParam(':eAd', $_POST['email'], PDO::PARAM_STR);
      $rSql->bindParam(':pas', $pas, PDO::PARAM_STR);
      $rSql->bindParam(':nfst', $_POST['nfst'], PDO::PARAM_STR, 20);
      $rSql->bindParam(':nlst', $_POST['nlst'], PDO::PARAM_STR, 20);
      $rSql->execute();

      $this->getOrgCiD($iU, $iC); // Add user in 'All' Community of this CLient
      if ($rSql->rowCount()>0) {
        $descB = "Registration"; // For brief description about transaction (len 20 varchar)
        $descD = "User registered as a Regular Active User"; // For Details description about transaction (len 255 varchar)
        $data = json_encode($_POST);
        // Userid,clientid, tablepkey,tablename,module name(handle),action,description brief,escription detail,data(json data)
        $this->logActivity($rDb, $iU, $iC, $iU, 'user', 'Reg','U', $descB, $descD, $data); // Call storeprocedure function in company file for adding activity trail
        return 1;
      }
      $rDb = null;
    } catch (PDOException $e) {
      $errm = "Username already exists";
      return $errm; 
    }
  }

  public function chkUsrExis($sKey) { // Check user exists with username 
    $rDb = $this->DbCon();
    $uStmt = $rDb->prepare(" SELECT idUser, emailAddress, idClient FROM user 
                             WHERE username = :usr 
                              AND status = 8 ");  
    try {
      $uStmt->bindParam(':usr', $sKey, PDO::PARAM_INT);
      $uStmt->execute();
      $uExis = $uStmt->fetch(PDO::FETCH_OBJ);
      $rDb = null;
      if (count($uExis) > 0) {
        return $uExis;
      } else {
        return 'You are unable to Register';
      }      
    } catch (PDOException $e) {
      $errm = "Username already exists";
      return $errm; 
    } 
  } 

  public function sForgotPwd() { // Send password to users by email
    if (trim($_POST['usr']) == '') {
      $vErr = "Please Enter  Username OR Email";
      return $vErr;
    } else {          
      try {
        $rDb  = $this->DbCon();
        $fSql = $rDb-> prepare("  SELECT idUser,emailAddress,username FROM user 
                                  WHERE (username = :usrN 
                                    OR emailAddress = :usrN) 
                                    AND status>8 
                                  LIMIT 1 ");
        $fSql->bindParam(':usrN', $_POST['usr'], PDO::PARAM_STR, 20);
        $fSql->execute();
        $fUd = $fSql->fetch(PDO::FETCH_OBJ);
       
        if (is_object($fUd)) {
          $aGpwd = md5($this -> generateRandomString());
          $uSql  = $rDb -> prepare(" UPDATE user SET password= :pw WHERE idUser = :usId ");
          $uSql->bindParam('usId', $fUd->idUser, PDO::PARAM_INT);
          $uSql->bindParam('pw', $aGpwd, PDO::PARAM_STR);
          $uSql->execute();

          if ($uSql->rowCount() > 0) {
            $isMail = $this -> fPasswordMail($fUd->emailAddress,$fUd->username,$aGpwd); // Send mail to user

            $descB = "Forgot Password"; // For brief description about transaction (len 20 varchar)
            $descD = "Sent mail to user with new password"; // For Details description about transaction (len 255 varchar)
            $data = json_encode($_POST);
            // Userid,clientid, tablepkey,tablename,module name(handle),action,description brief,escription detail,data(json data)
            $this->logActivity($rDb, $fUd->idUser, '', $fUd->idUser, 'user', 'fpwd','U', $descB, $descD, $data); // Fpwd= forgot password ,call storeprocedure function in company file for adding activity trail
            return $isMail;
          }
        } else {
          $vErr = "Username or Email do not exist";
          return $vErr;
        }
      } catch (PDOException $e) {
        $errm = "Error Code: 200. Please contact System Administrator";
        return $errm; 
      } 
    }
  }

  function getOrgCiD($idUser, $iC) { // Insert this member into All Community also
    $sqlOc = " SELECT id FROM community WHERE idClient = ".$iC." AND name ='All' " ; // Select org community in this client
    $sqlOadd = " INSERT into communityMember(idCommunity, idUser, status, created) values(:idCommOrg, :idUser, :status, now()) ";
    $db  = $this->DbCon();
    $stmtCo = $db->prepare($sqlOc); // Get community id with name of ORG
    $stmtCo->bindParam("idClient", $iC);
    $stmtCo->execute();
    $iOrgcId = $stmtCo->fetch(PDO::FETCH_OBJ);
    if (is_object($iOrgcId)) { 
      $stmtA = $db->prepare($sqlOadd);
      $stmtA->bindParam("idUser", $idUser);
      $stmtA->bindParam("idCommOrg", $iOrgcId->id);    
      $status = 9; // Normal
      $stmtA->bindParam("status", $status);
      $stmtA->execute();
    }
  } 

  public function fPasswordMail($eAddress,$uSer,$aGpwd) { // Send mail to users 
    $to      = $eAddress;
    $from    = 'admin@companysaas.com';
    $subject = 'Forgot Password';
    $message = 'Hello '.$uSer.'<br><br>
                Your new Password: <b>'.$aGpwd.'</b><br><br>
                You can login <a href="http://alpha/z/user/login/">here</a>.<br><br>
                Thanks,<br>
                company Admin';
    // To send HTML mail, the Content-type header must be set
    $headers  = 'MIME-Version: 1.0' . "\r\n";
    $headers .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";
    // Additional headers
    $headers .= 'To:'.$to . "\r\n";
    $headers .= 'From:'.$from . "\r\n";
    if (mail($to, $subject, $message, $headers))
      return 1;
    else return 'Use correct Username or Email';
  } // FPasswordMail

  // Generate a random string of numbers  for Password
  public function generateRandomString($length = 7) {
    return substr(str_shuffle("0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"), 0, $length);
  }
} 
?>