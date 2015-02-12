/**
Author: MI 
Description: Client Module. 
Used in: App Module
*/
define([
  'marionette',
  'app.vent',
  'corso',
  'ag/router'		// Defining the Router for the Client module

], function(Marionette, Vent, Corso, Router) {
  'use strict';

  return {
    initialize: function() {
			var
			App = require('app'),
			ClientsModule = App.module('ClientsModule', function() {
				// prevent starting with parent
				this.startWithParent = false;
				// module handle
				this.handle = 'ag';

				var API = {

					// Get Clients using the idClient of the Client as parameter
					getClients: function(idClient) {
						Corso.startCloseModules("ClientsModule", App);

						require(['ag/ctr/clients'], function(ClientsController) {
							// Create a new controller
							ClientsModule.controller = new ClientsController({
								idClient: idClient,
								handle: ClientsModule.handle  
							});
						});
					}
				};
				this.router = new Router({
					controller: API
				});
			});
			return ClientsModule;
		}
	};
});