<?php
/* File: Php Router
 * company Standard: Each Php file will be defined as PACKAGE/MODULE.FILE.php
 * eg. z/admin.client.php where 
 * PACKAGE: one letter name from a-y. z reserved for system/global files
            we will have one folder per Package. eg 'a' is for 'Ideas Manager'
 * MODULE.FILE: admin.client.php is part of the admin module. If MODULE 
 * is generic or as yet undecided use "mod" as MODULE e.g.mod.ideasTracker.php
 */


$sErr1 = "This activity has been logged. Your IP is being reported";

$aURI = explode("/", $_GET["url"]);

if (!preg_match("/^[a-z]$/", $aURI[0])) {
	/* We wouldnt like our files(/data) to be accessed directly from the url
	   Many additional parameter checks will come in here as we lock our system to a 
	   particular domain name and IP address */
  die($sErr1);
} 

require_once($aURI[0]."/".$aURI[1].".".$aURI[2].".php"); 
// If filename(above) is incorrect, Script will be stopped

?>
