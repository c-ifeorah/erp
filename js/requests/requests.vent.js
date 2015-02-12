/**
Application Central Request/Response Vent
@module Requests
*/

/*
Requires:
  * jQuery
  * Backbone
  * Marionette
  * Underscore
Contents:
  * Return a new request/response object
*/

define([

	'backbone',
  'marionette'

], function(Backbone, Marionette) {

  // Return a new request/response object
  return new Backbone.Wreqr.RequestResponse();

});