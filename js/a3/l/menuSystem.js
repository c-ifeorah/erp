/**
Author: MI
Description: Layout for MenuSystem, specifying the region, events and user interface
Used in: MenuSystem Controller
*/
define([
  'marionette',
  'tpl!/t/a3/menuSystem.tmpl',  // The MenuSystem template
  'requests/requests.vent',
  'commands/commands.vent',
  'bootstrap.dropdown'

], function(Marionette, Template, Requests, Commands) {
  'use strict';

  return Marionette.Layout.extend({
    template: Template,
    regions: {
      menu: '#page-header-menu'
    },
    ui: {
      mainMenu: '#main-menu'
    },
    events: {
      'click #menu-logout': 'logout'
    },

    initialize: function() {
      // Listen to any change events
      this.listenTo(this.model, 'change', this.render, this);
    },

    // L
    logout: function(e) {
     // var sMod = Requests.request('get:current:module:name');
     var sMod = window.location.hash.substr(1,parseInt(window.location.hash.length)-1); 
      // Send the logout request
      $.ajax({
	      url: 'z/sys/corso/ax/logout',
        type: 'POST',
        async: false,
        success: function() {
          // Redirect the user to the login form and control address location for relogin
          Commands.execute('navigate:login', sMod);
          window.location.replace('z/user/login/#'+sMod);
          _.each(_.keys(sessionStorage), function(key) {
            delete sessionStorage[key]; // Empty session storage
          }); 
        }
      });
      e.preventDefault();
    },

    // Control the effects of the drop down menus and keep them hidden
    hideDropdowns: function() {
      // reset the dropdowns
      this.$el.find('ul[role=menu]').css('display', 'none');
    } 
  });
});