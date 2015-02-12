/**
Main Application - Vent
@module Application
@submodule Application.Vent
*/

/*
  * Return a new Event aggregator
*/

define([
  'marionette'
], function(Marionette) {

  // Return a new Event aggregator
  return new Backbone.Wreqr.EventAggregator();

});