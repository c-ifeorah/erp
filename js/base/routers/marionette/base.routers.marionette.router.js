/**
Base Marionette Router
@module Base
@submodule Base.Marionette.Router
*/

/*
Requires:
  * Backbone
  * Marionette
  * jQuery
  * Underscore
Contents:
  * Base Router
    * before
    * after
    * getRouteParams
*/

define([

  'marionette',
  'app.vent',
  'commands/commands.vent',
  'requests/requests.vent'

], function(Marionette, Vent, Commands, Requests) {

  'use strict';

  /**
  Base Router
  @class SystemApp.Views.DetailLayout
  @constructor
  @extends Marionette.Layout
  */
  return _.extend(Marionette.AppRouter.prototype, {

    /**
    @method formatDate
    @param route {Date} The requested route
    @param params {Date} The requested route params
    */
    before: function(route, params) {

      // Add the previous params to the App state model
      Commands.execute('set:state:data', {

        previousParams: Requests.request('get:state:data').get('currentParams')

      });
    },

    /**
    @method formatDate
    @param route {Date} The requested route
    @param params {Date} The requested route params
    */
    after: function(route, params) {

      // Add the current params to the App state model
      Commands.execute('set:state:data', {

        currentParams: this.getRouteParams(route, params)

      });

    },

    /**
    @method getRouteParams
    @param route {Date} The requested route
    @param params {Date} The requested route params
    */
    getRouteParams: function(route, params) {

      var
      paramsObject = {},
      // Regex to match :key 
      regExp = /\:([^/]+)/g,
      // Detect matches (Array)
      matches = route.match(regExp);

      // Loop through each match
      _.each(matches, function(value, index) {

        // Remove any none alpabetical characters
        var objKey = value.replace(/[^A-Za-z]+/g, '');

        // Add the key and param value to object
        paramsObject[objKey] = params[index];
      
      });

      return paramsObject;

    }

  });

});