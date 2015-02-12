/**
Author: MI
Description: Layout for each Client, specifying the region, triggers and user interface
Used in: Client Controller
*/
define([
  'marionette',
  'tpl!/t/ag/client.layout.tmpl', // Defining the template for layout of each Client form
  'bootstrap.tabdrop'

], function(Marionette, Template) {
  'use strict';

  return Marionette.Layout.extend({
    template: Template,
    ui: 
    {
      tabs: '#client-tabs',
      clientDeleteDiv : '#client-delete',
      clientDeleteInfo : '#client-delete-info'
    },

    triggers : {
      'click #client-confirm-delete' : 'client:destroy',
      'click #client-cancel-delete' : 'client:cancel:destroy'
    },
 
    regions: {
      form: '#client-form'
    }
  });
});