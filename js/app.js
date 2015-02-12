/* Main Application
*/

define([

  'marionette',
  'corso',
  'config/backbone/config.backbone.sync',
  'config/backbone/config.backbone.validation',
  'm/z/system.session.m',
  'app.module',

  'commands/commands.vent',
  'requests/requests.vent',
  'commands/commands.init',
  'requests/requests.init',
  
  'base/models/backbone/base.backbone.model',
  'base/collections/backbone/base.backbone.collection',
  'base/collections/backbone/base.backbone.pageablecollection',
  'base/controllers/marionette/base.marionette.controller',
  'base/views/marionette/base.marionette.view',
  'base/views/marionette/base.marionette.compositeView',
  'base/module/marionette/base.marionette.module',
  'jquery.panels'

], function(Marionette, oCorso, SyncConfig, ValidationConfig, SessionModel, MainModule, Commands, Requests, CommandList, RequestList) {

  'use strict';

  oCorso.getUserDetails();

  // Define the Marionette Application  
  var App = new Marionette.Application();
  
  App.components = {};
  window.App = App; // For testing
  
  // Main Application Regions
  App.addRegions({
    header: '#page-header',
    main:   '#page-main',
    panels: '#panel-wrapper'
  });

  // Before Initialisation  
  App.on('initialize:before', function() {
    SyncConfig.initialize();  // Init Bb.Sync.extension
    CommandList.initialize(); // Init all commands
    RequestList.initialize(); // Init all requests
    ValidationConfig.initialize(); // Init Form validation plugin
  });

  App.addInitializer(function() { // Add Initialisers

    var sMod = Requests.request('get:current:module:name'),
        sessionModel = new SessionModel(sMod),
        bLoggedIn = false;

    sessionModel.fetch({ // Fetch the model data

      async: false,
      cache: false,
      type: 'POST',
      success: function(model, response) {
        
        if (response.success) { // Are we logged in? 
          bLoggedIn = true;
          App.session = sessionModel; // Attach the sessionModel to the App
          // if (sMod=='') sMod ='ax/as';
          // window.location.replace('/#'+sMod);
        }

      }
    });

    if (bLoggedIn) { // Is the user logged in?
      $('#panel-wrapper').panels({ // Initialise the panels
        topPanel: true,
        rightPanel: true,
        bottomPanel: true,
        leftPanel: true,
        touchEnabled: false,
        touchActiveState: false,
        onInit: function(instance) {

          App.components.panels = instance;
          // Add the plugin instance to the app state object so we can add events in views
          // Commands.execute('set:state:data', {
          //   panels: instance
          // });
        }
      });

      MainModule.initialize(); // Initialise the main module
      App.module('MainModule').start(); // Start the module

    } else {
      Commands.execute('navigate:login', sMod); // Send user to the login form
    }
  });

  
  App.on('initialize:after', function() { // Post-Initialisation

    if (Backbone.history) { // Is Backbone history available?
      Backbone.history.start(); // Start it up!
      // Go to the dashboard
      // Commands.execute('app:navigate', {
      //   route: 'ax/as'
      // });

      // Bind to all route events
      Backbone.history.bind('all', function (route, router) {
        App.header.currentView.hideDropdowns(); // Hide any dropdown menus
      });

    }

  });

  return App;
});


/*Filename: app.js
define([
  'marionette','corso','jquery', 'underscore', 'backbone','router', 'v/z/system.menu.hor.v'
], function(Marionette, oCorso, $, _, ß, Router, vMenu){

  var initialize = function(){
    cLogin = oCorso.cLoginChk(); //call login function in corso js file, once on app load
    // Pass in our Router module and call its initialize function
    if(cLogin != "") { //before page loading clogin equals null , after login check only cLogin gets succes message then menu loads
      Router.init();
      ß.history.start();
      var oMenu = new vMenu();     // Display the Menu structure
      window.setInterval(function() {
        cLogin = oCorso.cLoginChk(); //every 20 minutes it will check session exists or not, if not then go to login page
      }, 1200000); //1000 = 1 sec
    }
  };

  return { 
    init: initialize
  };
  
});
*/