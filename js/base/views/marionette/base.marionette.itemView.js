/**
Base Marionette Item View
@module Base
@submodule Base.Marionette.ItemView
*/

/*
Requires:
  * Backbone
  * Marionette
  * jQuery
  * Underscore
Contents:
  * onBeforeClose
*/

define([

  'marionette'

], function(Marionette) {

  'use strict';

  return _.extend(Marionette.ItemView.prototype, {
		
		/**
    @method onBeforeClose
    */
		onBeforeClose: function() {

		}

	});

});