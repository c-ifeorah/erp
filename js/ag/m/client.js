/**
Author: MI 
Description: Model containing a Menu  
Used in: Collection, Controller
*/
define([
  'backbone',
  'backbone.validation',
  'backbone.mutators'

], function(Backbone) {
  'use strict';

  return Backbone.Model.extend({
    idAttribute: 'idClient',
    url: 'a/cli/ent',
    defaults: {
      'Name':     '',
      'Passport': "", 
      'SubDomain': '',
      'emailAddress': "",
      'username':  ''
    },

    initialize: function(options) {
      // If a passport is specified, then the page should adopt this as its url instead
      if (options && options.Passport) {
        this.url+= "/" + options.Passport;
      }
    },

    // Function to specify the url for a page reset
    resetUrl:   function()  {
      this.url ='a/cli/ent'
    },

    // Input validation for adding a new model
    validation: {
      Name: {
        required: true,
        msg: 'Please enter a client name'
      },
      emailAddress: {
        required: true,
        pattern: "email", 
        msg: 'Please enter a valid super user email'
      },
      SubDomain: {
        required: true,
        msg: 'Please enter a subdomain name'
      }
    }
  });
});