<?php
  if ( isset($_POST['a']) && $_POST['a'] !='') {
    require_once 'cls.company.php';
    $¢ = new company(0);
    $s = $¢->logIn();

    if ($s === true) {
      if (isset($_POST['hashUrl']) && ($_POST['hashUrl'] != '' && $_POST['hashUrl']!='/')) {
       header('Location: /#'.$_POST['hashUrl']);
      }  else header('Location: /#ax/as');
      exit;
    } else if ($s === false) {     
      $sErr = "Your details are incorrect. Please try again.";
    } else if ($s == 'error') {
      $sErr = "Error: 200 Kindly contact your Administrator";
    }
  } else {
    $sErr = "";
  }
?>
<!doctype html>
<html class="login-wrapper">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="description" content="Enterprise Architecture Solutions">
    <meta name="author" content="martin.owen@company.co.uk">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <link rel="shortcut icon" href="../../../imgs/system/favicon.ico"/>
    <title>company SPP Login</title>
    <link rel="stylesheet" type="text/css" href="../../../ss/css/main.css">
  </head>
  <body>
    <div class="row extra-margin-top login-page">
      <div class="column large-4 medium-6 small-10 fixed-wrapper login-box">
        <div class="centered-text border-bottom padding-bottom">
          <img src="../../../imgs/system/company-logo.jpg" alt="Login">
        </div>
        <div class="row padding-top padding-right padding-left">
          <div class="column large-3 medium-12 mascot-img">
            <img src="../../../imgs/system/mascot.jpg" alt="company">
          </div>
          <div class="column large-9 medium-12 login-legend-box">
            <?php if (!empty($_GET['reg'])) {?>
              <label class="text-green">Registration successful, you may now log in.</label>
            <?php } ?>
            <form id="login" method="post" class="pure-form pure-form-custom" action="">
              <fieldset class="pure-group">
                
                <legend>Login</legend>

              
              <input type="hidden" name="a" value="1">
              <div  <?php echo (isset($sErr) && $sErr!='') ? "class=\"login-error\" " : ""; ?> >
                <?php if (isset($sErr)) echo $sErr; ?>
                  <!-- <label for="user-email">Username / Email Address</label> -->
                  <input name="usr" id="username" type="text" 
                         <?php echo (isset($_POST['usr'])) ? " value=\"".$_POST['usr']."\"" : "" ;?> 
                         placeholder="Username or email address" autofocus class="pure-input-1">   
                  <p class="usererror no-margin-top form-error" style="display:none">Please enter your username or email address</p>  
                  <!-- <label for="user-email">Password</label> -->
                  <input id="password" type="password" placeholder="Password" class="pure-input-1" >
                  <input name="pas" id="passwordHidden" type="password" style="display:none;">
                  <p class="passrerror no-margin-top form-error" style="display:none">Please enter your password</p>  
                  <p><a href="../../user/forgotPassword">Forgot your password?</a></p>
              
              </div>
              </fieldset>             
                <input type="submit" id="submit" name="submit" data-form-button="" class="pure-button pure-button-custom full-width" value="Submit">
                <input type="hidden" name="hashUrl" id="hashUrl" value="">
                
            </form>
          </div>
        </div>
      </div>
    </div>
    
    <script type="text/javascript" src="../../../js/libs/jquery/jquery-min.js"></script>
    <script type="text/javascript" src="../../../js/libs/company/md5.js"></script>
    <script>
      $(document).ready(function() {
        $('#hashUrl').val(window.location.hash.substr(1,parseInt(window.location.hash.length)-1));
        $('#submit').click(function(origEvent) {
          var usernameEl = $('#username'),
              username = usernameEl.val(),
              usernameError = $('.usererror'),
              passwordEl = $('#password'),
              password = passwordEl.val(),
              passwordError = $('.passrerror');
          if (!username) {
            usernameError.show();
            usernameEl.addClass('error');
            usernameError.html('Please enter your username or email address');
            return false;
          } else if (!password) {
            passwordError.show();
            passwordEl.addClass('error');
            passwordError.html('Please enter Password');
            return false;
          } else {
            $("#passwordHidden").val(md5(password));
            $('form').submit();
          }
        });
      });
    </script>
  </body>
</html>
