/**
Author: MI 
Description: Toolbar View of the Client Module
Used in: Clients Controller
*/
define([
  'marionette',
  'tpl!/t/ag/clientsToolbar.tmpl',    // Defining the template for the toolbar 
  'commands/commands.vent',
  'behaviors/behaviors.typeahead'

], function(Marionette, Template, Commands, Typeahead) {
  'use strict';

  return Marionette.ItemView.extend({
    template: Template,
    ui: {
      showButton: '#toolbar-list-show-button',
      searchButton: '#toolbar-search-button',
      addButton: '#toolbar-add-button',
      searchInput: '#toolbar-clients-search-input',
      clientName: "#current-client"
    },

    triggers: {
      'click #toolbar-search-button': 'list:init',
      'click #toolbar-list-show-button': 'list:show',
      'click #toolbar-add-button': 'add:item'
    },

    behaviors: {
      // Search behaviour for the Client Module
      Typeahead: {
        behaviorClass: Typeahead,
        elements: [
          {
            id: 'toolbar-clients-search-input',
            multiple: false,
            data: {
              collection: 'searchCollection',
              text: 'Name',
              value: 'Passport'
            },
            onSelect: function($e, datum, view) {
              // Update the hash to include the id
              Commands.execute('app:navigate', {
                route: 'ag/' + datum.value,
                trigger: true
              });
            }
          }
        ]
      }
    }
  });
});