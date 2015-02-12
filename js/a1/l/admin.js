/**
Author: MI
Description: Layout for the admin module, specifying all regions and user interface
Used in: Controller
*/
define([
  'marionette',
  'tpl!/t/a1/admin.layout.tmpl' // defining the template file for this layout

], function(Marionette, Template) {
  'use strict';

  return Marionette.Layout.extend({
    className: function() {
      // Return the class name based on display type
      return (this.options.displayType === 'panel') ? '' : 'fixed-wrapper';
    },

    template: Template,

    ui: {
      tabs: '#adminTag-tabs',
      adminTagDeleteDiv : '#adminTag-delete',
      adminTagDeleteInfo : '#adminTag-delete-info'
    },

    triggers: {
      'click #adminTag-confirm-delete' : 'adminTag:destroy',
      'click #adminTag-cancel-delete' : 'adminTag:cancel:destroy'
    },

    regions: {
      header: '#module-header',
      list: '#module-list',
      details: '#module-details'
    }
  });
});
