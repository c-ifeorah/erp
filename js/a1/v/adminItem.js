/**
Author: MI 
Description: Item View for each tag. 
Used in: CompositeView, Controller
*/
define([
  'marionette',
  'tpl!/t/a1/adminItem.tmpl',   // Defining the template for this view
  'commands/commands.vent'

], function(Marionette, Template, Commands) {
  'use strict';

  return Marionette.ItemView.extend({
    template: Template,
    tagName: 'tr',
    // Trigger for the remove button
    triggers: {
      'click #adminTag-remove': 'adminTag:ask:delete'
    },
  });
});