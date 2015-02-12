/**
Main Application - Module
@module Application
*/

define([

	'marionette',
	'app.controller',
	'modules/z/system.dashboard.module', ///!!!
	'aj/module',
	'ag/module',
	'ab/module',
	'av/module',
	'aw/module',
	'au/module',
	'aa/module',
	'ar/module',
	'as/module',
	'ad/module',
	'ac/module',
	'ap/module',
	'at/module',
	'al/module',
	'ay/module',
	'ah/module',
	'ak/module',
	'az/module',
	'ao/module',
	'af/module',
	'ae/module',
	'a1/module',
	'a3/module'

], function(Marionette, Controller, DashboardModule, UsersModule, ClientsModule, CommunityModule, ConceptAuthModule, MetaJourneysModule, TaskManagerModule, MetatypesModule, ConceptsModule, CampaignsModule, ModulesModule, PackagesModule, AHPRankgModule, CampaignsAdModule,  MetaAHPModule, JourneysModule, ScorecardsModule, ComparisonsModule, ProjectsModule, KanbanModule, UserAssignModule, ClientPurchaseModule, AdminModule, MenuSystemModule) {

	'use strict';

	return {

		// @method initialize		
		initialize: function() {

			var 
			App = require('app'),
			MainModule = App.module('MainModule', function() {

				// prevent starting with parent
				this.startWithParent = false;

				// Do this when this module is started
				this.addInitializer(function() {

					DashboardModule.initialize();
					MetaJourneysModule.initialize();
					CampaignsModule.initialize();
					ModulesModule.initialize();
					PackagesModule.initialize();
					CampaignsAdModule.initialize();
					ProjectsModule.initialize();
					JourneysModule.initialize();
					ClientsModule.initialize();
					KanbanModule.initialize(); // Journey Board Module
					TaskManagerModule.initialize(); 
					UsersModule.initialize();
					CommunityModule.initialize(); // Communities Module
					ConceptAuthModule.initialize();
					MetatypesModule.initialize();
					ConceptsModule.initialize();
					AHPRankgModule.initialize(); // AHP Ranking Module
					MetaAHPModule.initialize();
					ScorecardsModule.initialize();
					ComparisonsModule.initialize();
					UserAssignModule.initialize();
					ClientPurchaseModule.initialize();
					AdminModule.initialize();
					MenuSystemModule.initialize();

				});
				
				// Start Event
				this.on('start', function() {
					// Create a new controller
					MainModule.controller = new Controller();
				});

			});

			return MainModule;

		}

	};

});
