/**
Author: MI
Description: Layout for the Client module, specifying all regions
Used in: Clients Controller
*/
define([
  'marionette',
  'tpl!/t/ag/clients.layout.tmpl' // defining the template file for this layout

], function(Marionette, Template) {
  'use strict';

  return Marionette.Layout.extend({
    className: function() {
      // Return the class name based on display type
      return (this.options.displayType === 'panel') ? '' : 'fixed-wrapper';
    },
    template: Template,
    regions: {
      header: '#module-header',
      list: '#module-list',
      details: '#module-details'
    }
  });
});
