/**
Author: MI 
Description: Form View of each Client.
Used in: Client Controller
*/
define([
  'marionette',
  'commands/commands.vent',
  'tpl!/t/ag/client.tmpl',    // Defines the template for dispaying a client form
  'behaviors/behaviors.showPasswords',
  'backbone.syphon',
  'backbone.validation',
  'jquery.okeyDokey'

], function(Marionette, Commands, Template, ShowPasswords, Syphon) {
  'use strict';

  return Marionette.ItemView.extend({
    template: Template,

    className: function() {
      // Extra styling for readOnly view
      if (this.options.displayType === 'readOnly') {
        return 'fixed-wrapper no-border no-padding';
      }
      else { return; }
    },

    ui: {
      viewReadOnly: '#client-read-only',
      viewForm: '#client-form-view'   
    },

    // Specifying the buttons on each form
    form: function() {
      return {
        buttons: {
          primary: 'Save',
          remove: 'Remove'
        }
      };
    },
 
    initialize: function() {
     this.model.resetUrl();
      // Init Okey Dokey
      $('body').okeyDokey({
        iconOk: '<i class="icon-ok"></i>',
        iconFail: '<i class="icon-cancel"></i>'
      });
    },

    // Function that triggers the save event
    save: function(data) {
      this.trigger('client:save');
    },

    // Function that triggers the remove event
    removeItem: function(e) {
      this.trigger('client:ask:delete');
    },

    // Function to show the list of clients
    cancel: function(e) {
      // Do we have a toolbar view?
      if (this.options.toolbarView) {
        // Show the list again
        this.options.toolbarView.trigger('list:show');
      }
      else {
        // Go back
        window.history.go(-1);
      }
    }
  });
});