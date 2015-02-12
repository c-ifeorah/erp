/**
Author: MI 
Description: Toolbar View of the Admin Module
Used in: Admin Controller
*/
define([
  'marionette',
  'tpl!/t/a1/adminToolbar.tmpl',  // Defining the template for the toolbar 
  'commands/commands.vent',
  'behaviors/behaviors.typeahead'

], function(Marionette, Template, Commands, Typeahead) {
  'use strict';

  return Marionette.ItemView.extend( {
    template: Template
  });
});