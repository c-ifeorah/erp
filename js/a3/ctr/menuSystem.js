/**
Author: MI 
Description: Controller for the MenuSystem module
Used in: App Module, App.controller
*/
define([
  'marionette',
  'a3/l/menuSystem',  // Layout for the MenuSystem that defines menu properties and UI
  'slimmenu'

], function(Marionette, MenuSystemLayout) {
  'use strict';

  return Marionette.Controller.extend({
    initialize: function(options) {
      var
      that = this,
      App = require('app');

      // Define the main panel region
      this.region = App.header;

      // Get the session model
      this.model = App.session;

      // Define the controller layout
      this.layout = new MenuSystemLayout({
        model: this.model
      });

      // Model change event
      this.listenTo(this.model, 'change', function() {
        // Re render required the menu to be re-initiated
        this.layout.ui.mainMenu.slimmenu({ resizeWidth: '800' });
      });

      // Fire this event when the layout is shown
      this.layout.on('show', function() {
        // Init flexnav
        this.ui.mainMenu.slimmenu({ resizeWidth: '800' });
              console.log(this.model.attributes.packages[0]);
              console.log(this);
      });

      // Show the MenuSystem layout
      this.region.show(this.layout);
    }
  });
});