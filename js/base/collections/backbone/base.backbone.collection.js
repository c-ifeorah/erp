/**
Base Backbone Collection
@module Base
@submodule Base.Backbone.Collection
*/

/*
Requires:
  * Backbone
  * jQuery
  * Underscore
Contents:
  * perPage
  * parse
  * save
*/

define([

  'backbone'

], function(Backbone) {

  'use strict';

  return _.extend(Backbone.Collection.prototype, {

    /**
    @method parse
    @param response {Object} The response from the server
    */
    parse: function(response) {

      // Is this an official API response?
      if (response.data) {

        // Return the API data
        return response.data;

      }
      else {

        // Return the raw json
        return response;
        
      }

    }

	});

});