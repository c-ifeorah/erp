/**
Main Application - Module
@module Application
@submodule Application.Controller
*/

/*
Requires:
  * jQuery
  * Backbone
  * Underscore
  * Marionette
Contents:
  * Main App Controller
		* initialize
    * showHeader
    * showMain
    * showPanels
*/

define([

  'marionette',
  'a3/ctr/menuSystem',
  'ctr/z/system.main.ctr',
  'components/panels/panels.controller',

], function(Marionette, HeaderController, MainController, PanelsController) {

  'use strict';

  /**
  Main App Controller
  @class MainApp.Controller
  @constructor
  @extends Marionette.Controller
  */
  return Marionette.Controller.extend({

    initialize: function() {
      // Start the main layout controllers
      this.showHeader();
      this.showMain();
      this.showPanels();
    },

    //Header Controller
    showHeader: function() {
      // New header controller
      var headerController = new HeaderController();
    },

    //Main Controller
    showMain: function() {
      // New main controller
      var mainController = new MainController();
    },

    //Panels Controller
    showPanels: function(headerLayout) {
      // New panels controller
      var panelsController = new PanelsController();
    }

  });
});