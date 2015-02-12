<?php
/* File: api/z/regis.ter.php  */
 require_once('sys.registration.php');
    $secureKey  = substr(strrchr($_SERVER['QUERY_STRING'], '/'), 1);
    $uReg       =   new Registration(0); // Extended by company class, passing 0 means without login check
    if (is_numeric($secureKey)) {
        $iUe    =   $uReg->chkUsrExis($secureKey); // Check username with security key 
      
        if (is_object($iUe)) { // If its object means user exists with Secure key
            $uEmail = $iUe->emailAddress;           
        } else { 
            header("Location: ../../user/login");
        }        
    } else { // If url not exists
        header("Location: ../../user/login");
    }

    if (isset($_POST['submit']) && $_POST['submit']!='') {
        $nfst = $_POST['nfst'];
        $nlst = $_POST['nlst'];
        $language = $_POST['language'];
        // Save users with details and as well as add as a member of 'All' community
        $rResult = $uReg->saveUsers($iUe ->idUser, $iUe ->idClient); 
    } else {
        $nfst = '';
        $nlst = '';
        $language = 'en';
        $rResult ='';
    }

    // If Error exists
    if (isset($rResult) && $rResult!='') { 
        if (!is_numeric($rResult)) { 
            $sClass = "form-error text-red";
        } else { 
            $sClass = "success"; 
        }  
    } else $sClass = '';
?> 

<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="description" content="Enterprise Architecture Solutions">
    <meta name="author" content="martin.owen@company.co.uk">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <link rel="shortcut icon" href="../../../imgs/system/favicon.gif"/>
    <title>company SPP Registration</title>
    <link rel="stylesheet" type="text/css" href="../../../ss/css/main.css">
    <script type="text/javascript" src="../../../js/libs/jquery/jquery-min.js"></script>
    <style>
        .reg {
            background-color:#fff;
            position:absolute;
            top:20%;
            left:9%;
            border: 1px solid #cccccc;
        }
        a {
            color:#fff !important;
        }
        a:visited {
            color:#fff !important;
        }   
    </style>
</head>
<body>
    <div class="column large-10 medium-9 reg">
        <h2 class="centered-text">Registration</h2>
        <form id="login" method="post" class="pure-form pure-form-custom border padding" action="">
            <div class="row">
                <div class="centered-text <?php echo $sClass ;?>" >
                    <?php 
                        if (isset($rResult) && $rResult!='' ) { 
                            if (!is_numeric($rResult)) {
                                echo $rResult; 
                            } else { 
                                header("Location: ../../user/login?reg=true");
                            }
                        } 
                    ?>
                </div>
                   
                <div class="column large-4">
                    <fieldset>
                        <legend>Personal Details</legend>
                        <label for="user-email">First Name</label>
                        <input type="text" name="nfst" id="nameFirst" value="<?=$nfst;?>" class="pure-input-1 margin-bottom">
                        <p class="fnerror form-error" style="display:none">First Name Should not accepts Special Characters</p>  
                        <label for="user-email">Last Name</label>
                        <input type="text" name="nlst" id="nameLast" class="pure-input-1 margin-bottom" value="<?=$nlst;?>">
                        <p class="lnerror form-error" style="display:none">Last Name Should not accepts Special Characters</p>  
                        <label for="user-language">Language</label>
                        <div class="relative">
                            <select name="language" id="user-language" class="pure-input-1">
                                <option disabled>Choose a language</option>
                                <option disabled>-----------------</option>
                                <option value="en" <?php if($language=='en') echo 'selected'?>>English</option>
                                <option value="fr" <?php if($language=='fr') echo 'selected'?> >French</option>
                                <option value="ge" <?php if($language=='ge') echo 'selected'?>>German</option>
                                <option value="sp" <?php if($language=='sp') echo 'selected'?> >Spanish</option>
                                <option value="nl" <?php if($language=='nl') echo 'selected'?>>Dutch</option>
                                <option value="po" <?php if($language=='po') echo 'selected'?> >Portuguese</option>
                            </select>
                            <i class="icon-down-dir select-icon"></i>
                        </div>
                    </fieldset>                
                </div>

                <div class="column large-4">
                    <fieldset>
                        <legend>Account Details</legend>
                        <label for="user-username">Username</label>
                        <input type="text" name="usr" id="username" class="pure-input-1 margin-bottom">
                        <p class="usererror form-error" style="display:none">Username Should not accepts Special Characters</p> 
                        <label for="user-email">Email address</label>
                        <input type="text" value="<?=$uEmail;?>" name="email" id="email" class="pure-input-1 margin-bottom" readonly>                       
                    </fieldset>                
                </div>

                <div class="column large-4">                    
                    <fieldset>
                        <legend>Password</legend>
                        <label for="user-password">Enter a new password</label>
                        <input type="password" name="pas" id="password" class="pure-input-1 margin-bottom">
                        <p class="pwderror form-error" style="display:none">Enter Valid Password</p>  
                        <label for="user-password-confirm">Confirm your new password</label>
                        <input type="password" name="repas" id="repassword" class="pure-input-1 margin-bottom">
                        <p class="repwderror form-error" style="display:none">Password do not match</p> 
                        <label for="user-passwords-show" class="pure-checkbox">
                            <input type="checkbox" id="user-passwords-show" class="form-show-passwords"> Show passwords
                        </label>
                    </fieldset>                
                </div>
            </div>
            
            <div id="form-button-container" class="form-button-container centered-text">                
                <input type="submit" id="submit" name="submit" data-form-button="" class="pure-button pure-button-custom button-small" value="Register">
            </div>
        </form>
        <div>&nbsp;</div>
    </div>
    <script>
        $('#user-passwords-show').click(function() {
            var change =  $('#user-passwords-show').is(":checked") ? "text" : "password";
            $('#password').attr('type',change);
            $('#repassword').attr('type',change);
        });

        $( "#submit").click(function( event ) {
            var errormsg ='';
            if ($('#nameFirst').val()=='') {
                $('.fnerror').show();
                $('#nameFirst').addClass('error');
                $('.fnerror').html('Please enter your First Name.');
                errormsg+=$('.fnerror').text();
            } else if (!(/^\s*[a-zA-Z0-9,\s]+\s*$/.test($('#nameFirst').val()))) {
                $('.fnerror').show();
                $('#nameFirst').addClass('error');
                $('.fnerror').html('First Name cannot contain special characters.');
                errormsg+=$('.fnerror').text();
            } else $('.fnerror').hide();

            if ($('#nameLast').val()=='') {
                $('.lnerror').show();
                $('#nameLast').addClass('error');
                $('.lnerror').html('Please enter your Last Name ');
                 errormsg+=$('.lnerror').text();
            } else if (!(/^\s*[a-zA-Z0-9,\s]+\s*$/.test($('#nameLast').val()))) {
                $('.lnerror').show();
                $('#nameLast').addClass('error');
                 $('.lnerror').html('Last Name cannot contain special characters.');
                errormsg+=$('.lnerror').text();
            } else $('.lnerror').hide();

            if ($('#username').val()=='') {
                $('.usererror').show();
                $('#username').addClass('error');
                $('.usererror').html('Please enter a Username.');
                 errormsg+=$('.usererror').text();
            } else if (/^\s*[a-zA-Z0-9,\s]+\s*$/.test($('#username').val())== false) {
                $('.usererror').show();
                $('#username').addClass('error');
                $('.usererror').html('Username cannot contain special characters.');
                errormsg+=$('.usererror').text();
            } else $('.usererror').hide();

            if ($('#password').val()=='') {
                $('.pwderror').show();
                $('#password').addClass('error');
                $('.pwderror').html('Please enter a password.');
                 errormsg+=$('.pwderror').text();
            } else if ($('#password').val().length<5) {
                $('.pwderror').show();
                $('#password').addClass('error');
                $('.pwderror').html('Password length must be greater than 5 characters.');
                errormsg+=$('.pwderror').text();
            } else $('.pwderror').hide();

            if ($('#password').val()!=$('#repassword').val()) {
                $('.repwderror').show();
                $('#repassword').addClass('error');
                $('.repwderror').html('Passwords do not match.');
                errormsg+=$('.repwderror').text();
            } else $('.repwderror').hide();           
           
            if (errormsg =='' || errormsg ==' ') {
                $( "form" ).submit();
            } else return false;       
        });
    </script>
</body>
</html>
