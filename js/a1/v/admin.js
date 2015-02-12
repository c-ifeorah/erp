/**
Author: MI 
Description: Composite View of all tags. Specifying its container and item views contained
Used in: Controller
*/
define([
  'marionette',
  'commands/commands.vent',
  'a1/v/adminItem',   // Define the item view for each tag
  'tpl!/t/a1/admin.tmpl',   // Defining the template for this view
  'v/z/system.noItems.v',

], function(Marionette, Commands, ItemView, Template, NoItemsView) {
  'use strict';

  return Marionette.CompositeView.extend({
    template: Template,
    itemView: ItemView,
    itemViewContainer: '#adminTags-list',

    events: {
      'click th[data-key]': 'sortList'
    },

    initialize: function() {
      // Init Okey Dokey
      $('body').okeyDokey({
        iconOk: '<i class="icon-ok"></i>',
        iconFail: '<i class="icon-cancel"></i>'
      });
    },

    // Function to replace the view when there are no items
    emptyView: function() {
      return new NoItemsView({
        itemName: 'AdminTags',
        border: true,
        marginTop: true
      });
    }
  });
});