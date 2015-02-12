/**
Author: MI 
Description: Clients Controller for the Client module
Used in: App Module
*/
define([
  'marionette',
  'commands/commands.vent',
  'requests/requests.vent',
  'ag/c/clients', // Defining the collection that will be fetched and rendered to view
  'ag/v/clients', // Defining the composite view 
  'ag/m/client',  // Defining the model that will be displayed on selcting item view 
  'ag/l/clients', // Defining the layout of the module containing the various views
  'ag/v/clientsToolbar', // Defining the toolbar which will contain the header
  'ag/ctr/client' // Defining the client controller, that controls a specific client

], function(Marionette, Commands, Requests, Collection, ListView, Model, Layout, ToolbarView, ClientController) {
  'use strict';

  return Marionette.Controller.extend({
    initialize: function(options) {
      var
      that = this,
      App = require('app');

      // Define our client collection
      this.collection = new Collection();

      // Define the main view
      this.layout = new Layout({
        displayType: options.displayType
      });

      // Controller views
      this.views = {};

      // Define the list view
      this.views.list = new ListView({
        collection: this.collection
      });

      // Define the main region
      this.region = App.main.currentView.content;

      // Listen for the layout's 'show' event
      this.layout.on('show', function() {
        // Show the module header
        that.showHeader();
        // Has a client id been supplied?
        if (options.idClient) {
          // Show the user requested
          that.showDetails(undefined, options.idClient);
        }
        else {
          // Show the list
          that.showList();
        }
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
      toolBarView = new ToolbarView({
        searchCollection:   this.collection
      });
      this.toolBarView = toolBarView; // This should allow access to showDetails button
   
      toolBarView.on('add:item', function() { // This listens to the event when add button is clicked and renders a new empty model
      Commands.execute('app:navigate', {
          route: 'ag',
          trigger: false
        }); 
        that.showDetails(new Model())
      });
    
      toolBarView.on('list:show', function() { // This listens to the showbutton and renders the list when clicked
        that.showList();
      });
      this.layout.header.show(toolBarView);
    },

    // Display the list of all clients in the module
    showList: function() {
      var
      that = this,
      // We need pagination
      listWrapperView = Requests.request('get:pagination:wrapper', this.views.list);

      // Listen for the view render event
      this.views.list.on('itemview:client:show', function(view) {
         // Show the user details view
        that.showDetails(view.model);
        // Update the hash to include the id
        Commands.execute('app:navigate', {
          route: 'ag/' + view.model.get("Passport"),
          trigger: true // Setting the trigger to false stops the new page navigated to, from refreshing
        });
      });
      // Show the list view
      that.layout.list.show(listWrapperView);
    },

    // Display the specified client
    showDetails: function(model, Passport) {
      // Do we need to hide the list?
      if (this.layout.list.currentView) {
        // Hide the list
        this.layout.list.currentView.$el.hide();
      }
      this.toolBarView.ui.showButton.show();

      // Create a new client controller
      var that=this,
      clientController = new ClientController({
        header: this.layout.header,
        handle: this.options.handle,
        privileges: this.privileges,
        region: this.layout.details,
        model: model,
        Passport: Passport,
        userCollection: this.collection.fullCollection
      });

      //  Creating a specific toolbar header name for the current model in scope
      clientController.listenTo(clientController, "update:toolbar", function(model){
        if (model.get("Name").length >0){
          that.toolBarView.ui.clientName.text(": " + model.get("Name"));
        } else  {
          that.toolBarView.ui.clientName.text("");
        }
      })
    }
	});
});