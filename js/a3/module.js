/**
Author: MI 
Description: MenuSystem Module
Used in: App Module, App
*/
define([
  'marionette',
  'app.vent',
  'corso',
  'a3/router'		// Defining the Router for the MenuSystem module

], function(Marionette, Vent, Corso, Router) {
  'use strict';

  return {
    initialize: function() {
			var
			App = require('app'),
			MenuSystemModule = App.module('MenuSystemModule', function() {
				// prevent starting with parent
				this.startWithParent = false;
				// module handle
				this.handle = 'a3';

				var API = {
					// Get Menus using the idUser of the User as parameter
					getMenu: function(idUser) {
						Corso.startCloseModules("MenuSystemModule", App);

						require(['a3/ctr/menuSystem'], function(MenuSystemController) {
							// Create a new controller
							MenuSystemModule.controller = new MenuSystemController({
								idUser: idUser,
								handle: MenuSystemModule.handle  
							});
						});
					}
				};
				this.router = new Router({
					controller: API
				});
			});
			return MenuSystemModule;
		}
	};
});