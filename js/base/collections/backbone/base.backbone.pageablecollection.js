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

  'backbone',
  'backbone.pageable'

], function(Backbone) {

  'use strict';

  return _.extend(Backbone.PageableCollection.prototype, {

    /**
    @method _setOriginal
    */
    setOriginal: function() {

      // Set the original model attributes to use in reset method
      this._originalCollection = this.toJSON();

      return this;

    },

    /**
    @method parse
    @param response {Object} The response from the server
    */
    search: function(searchTerm) {

      // We require a search term
      if (searchTerm === '') { return this.fullCollection; }
      
      // Patter to filter on
      var pattern = new RegExp(searchTerm);

      // Return the filtered collection
      return _(this.fullCollection.filter(function(data) {

        return pattern.test(data.get('name'));

      }));

    },

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