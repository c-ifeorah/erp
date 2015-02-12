/**
Author: MI 
Description: Model containing a tag, its id, name and count as returned from the database via the server 
Used in: Collection, Controller
*/
define([
  'backbone',
  'backbone.validation',
  'backbone.mutators'

], function(Backbone) {
  'use strict';

  return Backbone.Model.extend({
    idAttribute: 'id',
    url: 'a/ad/min',
    defaults: {
      'id':  '',
      'count': '',
      'name': ''
    },

    // Function to specify the url for a page reset
    resetUrl: function()  {
      this.url ='a/ad/min'
    }
  });
});