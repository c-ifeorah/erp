/**
Author: MI 
Description: Item View for each Client. 
Used in: CompositeView, Clients Controller
*/
define([
  'marionette',
  'tpl!/t/ag/clientsItem.tmpl',   // Defining the template for this view
  'commands/commands.vent'

], function(Marionette, Template, Commands) {
  'use strict';

  return Marionette.ItemView.extend({
    template: Template,
    tagName: 'tr',
    triggers: {
      'click': 'client:show'
    },
  });
});