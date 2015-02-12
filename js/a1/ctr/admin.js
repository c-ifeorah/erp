/**
Author: MI 
Description: Controller for the Admin module
Used in: Admin Module
*/
define([
  'marionette',
  'commands/commands.vent',
  'requests/requests.vent',
  'a1/c/admin',   // Defining the collection that will be fetched and rendered on the view
  'a1/v/admin',   // Defining the composite view 
  'a1/l/admin',   // Defining the layout of the module where various views will be attached to
  'a1/v/adminToolbar' // Defining the toolbar which will contain the header

], function(Marionette, Commands, Requests, Collection, ListView, Layout, ToolbarView) {
  'use strict';

  return Marionette.Controller.extend({
    initialize: function(options) {
      var
      that = this,
      App = require('app');

      // Define our admin collection
      this.collection = new Collection();

      // Define the main view
      this.layout = new Layout({
        displayType: options.displayType
      });

      // Define the main region
      this.region = App.main.currentView.content;

      // Listen for the layout's 'show' event
      this.layout.on('show', function() {
        // Show the module header
        that.showHeader();
        that.showList();
      });
      // Fetch the model data
      this.collection.fetch();
 
      // Call the controller 'show' method  
      this.show({
        loader: true,
        view: this.layout,
        region: this.region,
        entities: this.collection,
        debug: false
      });
    },
  
    // Display the content of the toolbar
    showHeader: function() {
      var that = this,
      toolBarView = new ToolbarView();   
      this.layout.header.show(toolBarView);
    },

    // Display the list of all admin tags
    showList: function() {
      var
      that = this,
      listView = new ListView({
        collection: this.collection
      }),
      // We add pagination to the list view
      listWrapperView = Requests.request('get:pagination:wrapper', listView);

      // Listening to the remove event for each model
      listView.on('itemview:adminTag:ask:delete', function(option) {
        that.layout.ui.adminTagDeleteInfo.text(option.model.get('name') + ' has a use count of ' + option.model.get('count') + '. Do you still want to remove ?');
        that.layout.ui.adminTagDeleteDiv.show();
        that.model = option.model;
      });

      // When user clicks OK to delete
      that.layout.on('adminTag:destroy', function() {
        // delete the model
        that.model.destroy({
          wait: true,
          data: JSON.stringify(that.model), //  Sending Delete request with the data
          
          success: function() {
            // Trigger an okey dokey message
            $('body').trigger('okey:dokey');
          },

          error: function() {
            // Trigger a not okey dokey message
            $('body').trigger('not:okey:dokey');
          }
        });
        that.layout.ui.adminTagDeleteDiv.hide();
      });

      // When user clicks Cancel delete
      that.layout.on('adminTag:cancel:destroy', function() {
        that.layout.ui.adminTagDeleteDiv.hide();
      });
      // Show the list view
      that.layout.list.show(listWrapperView);
    }
	});
});