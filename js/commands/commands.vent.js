/**
Application Central Commands Vent
@module Commands
*/

/*
Requires:
  * jQuery
  * Backbone
  * Marionette
  * Underscore
Contents:
  * Return a new command object
*/

define([

  'marionette'

], function(Marionette) {

  // Return a new command object
  return new Backbone.Wreqr.Commands();

});