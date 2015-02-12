/**
Author: MI 
Description: Admin Module. 
Used in: App Module
*/
define([
  'marionette',
  'app.vent',
  'corso',
  'a1/router'	// Defining the Router for the Admin module

], function(Marionette, Vent, Corso, Router) {
  'use strict';

  return {
    initialize: function() {
			var
			App = require('app'),
			AdminModule = App.module('AdminModule', function() {
				// prevent starting with parent
				this.startWithParent = false;
				// module handle
				this.handle = 'a1';

				var API = {

					// Get AdminTags using the id of the Tag as parameter
					getTags: function(id) {
						Corso.startCloseModules("AdminModule", App);

						require(['a1/ctr/admin'], function(AdminController) {
							// Create a new controller
							AdminModule.controller = new AdminController({
								id: id,
								handle: AdminModule.handle  
							});
						});
					}
				};
				this.router = new Router(	{
					controller: API
				});
			});
			return AdminModule;
		}
	};
});