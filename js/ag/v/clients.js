/**
Author: MI 
Description: Composite View of all Clients. Specifying its container and item views contained
Used in: Clients Controller
*/
define([
  'marionette',
  'commands/commands.vent',
  'ag/v/clientsItem',   // Define the item view for each tag
  'tpl!/t/ag/clients.tmpl',   // Defining the template for this view
  'v/z/system.noItems.v',

], function(Marionette, Commands, ItemView, Template, NoItemsView) {
  'use strict';

  return Marionette.CompositeView.extend({
    template: Template,
    itemView: ItemView,
    itemViewContainer: '#clients-list',
    events: {
      'click th[data-key]': 'sortList'
    },

    // Function to replace the view when there are no items
    emptyView: function() {
      return new NoItemsView({
        itemName: 'clients',
        border: true,
        marginTop: true
      });
    }
  });
});