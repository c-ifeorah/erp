
define([
  'jquery'
], function($, App) {

    var result = '';
    var sMod = window.location.hash.substr(1,parseInt(window.location.hash.length)-1); //getting module name in the url after #
    var oCorso = { //create js object here
      async: false,
      processData : false,
      cache       : false,
      contentType : false,
      type        : "POST",
      
      cLoginChk: function() { //check login functio n 
        $.ajax({
          url: 'z/sys/corso/'+sMod+'/login', //it calls login function in class file
          type: this.type,
          processData: this.processData,
          cache: this.cache,
          async: this.async,
          contentType: this.contentType,
          success:this.dataHandler
        });
        return result;
      },

      dataHandler: function(data) { //return data common to all success function in ajax 
        if (JSON.parse(data).success === true || JSON.parse(data).error.message == 'fileupload') { 
          result = data;
        }
        if (JSON.parse(data).success === false && JSON.parse(data).error.message == 'login') //if its error then return to login page
          window.location.replace('z/user/login/#'+sMod);
      },

      getLlogin: function() { // get last login 
        $.ajax({
          url: 'z/sys/corso/'+sMod+'/lastlogin', //it calls lastlogin function in class file
          type: this.type,
          processData: this.processData,
          cache: this.cache,
          async: this.async,
          contentType: this.contentType,
          success:this.dataHandler('')
        });
        return result; //return result
      },

      cLogOut: function(sModH) { 
        sMod =sModH; //assigned smodH from menu.hor.v.js file for overriding current module handler
        $.ajax({
          url: 'z/sys/corso/'+sMod+'/logout', //it calls lastlogin function in class file
          type: this.type,
          processData: this.processData,
          cache: this.cache,
          async: this.async,
          contentType: this.contentType,
          success:this.dataHandler
        });

        _.each(_.keys(sessionStorage), function(key) {
          delete sessionStorage[key];
        }); // empty session storage

        return result; //return result
      },

      removeModuleElements: function(dEl, sHTML) {
        dEl.hide();
        var onDataHandler = function(data) {
          try {
            var aReturnedElements = JSON.parse(data);
            if (aReturnedElements[0].success) {
              dEl.html(sHTML);
              aReturnedElements.splice(0, 1);

              for (var i = 0; i < aReturnedElements.length; i++) {
                aReturnedElements[i] = aReturnedElements[i].element;
              }

              var aLocalElements = $(dEl.selector+" [id]"); // elements of the views' El that have an Id
              for (i = 0; i < aLocalElements.length; i++) {
                if (aReturnedElements.indexOf(aLocalElements[i].id) == -1) {
                  $(aLocalElements[i]).remove(); // DOM element doesn't exist in the users' permissions, so it must be removed
                }
              }
              dEl.show(); // show the views' element here, as doing it on the view could show the users' an unedited page
            } else throw ""; // database call failed, throw an exception to trigger the alert
          } catch(e) {
            alert("Could not retrieve elements from database.");
            dEl.html("");
          }
        };

        $.ajax({
          url : 'z/sys/corso/'+sMod+'/elements', // calls the moduleElements function in the class file
          type : this.type,
          cache : this.cache,
          async : this.async,
          contentType : this.contentType,
          success : onDataHandler
        });
      },

      uploadFile : function(event, sPackage, userparam) {  
        //upload file function common to all
        this.pictureFile = event.target.files[0]; //get filevalues
        
        if (this.pictureFile) {
          var that = this,
              sModP = sMod;
          if (sMod.indexOf('/') != -1) { // for as/26
            sModP = sMod.split('/')[0];
          }
          var logoSrc = new FormData();
          logoSrc.append('file', this.pictureFile);
          logoSrc.append('sPackage', sPackage);
          logoSrc.append('sModuleHandler', sModP);
          logoSrc.append('userparam', userparam);

           $.ajax({
            url : "z/corso/fileupload", 
            type :this.type,
            data : logoSrc, 
            processData : this.processData,
            async : this.async,
            cache : this.cache,
            contentType : this.async,
            success : this.dataHandler
          });

          return result; //return result
        } 
      },

      startCloseModules : function(sCurrentModule, App) {
        _.each(_.keys(App), function(key) {
          if (App[key].moduleName) {

            if (key != 'MainModule' && key != sCurrentModule) {
              App[key].stop();
            } else if (key == sCurrentModule) {
              App[key].start();
            }

          }
        });
      },

      getUserDetails : function() {
        $.ajax({

          url : 'z/session/details',
          success : function(data) {
            var oData;
            try {
              oData = JSON.parse(data);
              _.each(_.keys(oData), function(key) {
                sessionStorage[key] = typeof oData[key] == "string" ? oData[key] : JSON.stringify(oData[key]);
              }); // populate session storage

            } catch (e) {
              // how to display an error at this stage?
            }

          }

        });

      }
    }
    return oCorso ; //return to js object to view file to define functions
  } 
)