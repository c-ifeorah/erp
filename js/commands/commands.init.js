/**
Initialise Application Commands
@module Commands
@submodule Commands.Init
*/

/*
Requires:
	* jQuery
	* Backbone
	* Marionette
	* Underscore
Contents:
	* Module Initialize
		* Initialise all the required commands
*/

define([

	'marionette',
	'commands/commands.vent',
	'requests/requests.vent',
	'components/panels/views/panels.views.header',
	'components/loader/loader.view',
	'components/sieve/sieve.controller',
	'jquery.tooltipster'

], function(Marionette, Commands, Requests, HeaderView, LoaderView, SieveController) {

	'use strict';

	return {

		/**
		Module Initialize
		@method initialize
		*/
		initialize: function() {

			/**
			App Navigation
			@event app:navigate
			@param route {String} The route to navigate the application to
			@param trigger {Boolean} Whether to call the route function
			@param callback {Callback} A callback function
			*/
			Commands.setHandler('app:navigate', function(options, callback) {

				// Options are not required, so...
				options = options || {};

				// Set defaults
				_.defaults(options, {

					trigger: true

				});

				// We require a route
				if (!options.route) { return; }

				// All ok, so allow navigation via the 'global router'
				Backbone.history.navigate(options.route, {

					trigger: options.trigger

				});

			});

			/**
			Navigate to the login form
			@event navigate:login
			*/
			Commands.setHandler('navigate:login', function(sMod) {

				// Go to the login form
				window.location.replace('z/user/login/#/' + sMod);

			});

			/**
			When Fetched
			@event when:fetched
			@param entities {Object} The entities to fetch
			@param callback {Function} Callback function
			@param debug {Boolean} Option to debug the code
			*/
			Commands.setHandler('when:fetched', function(entities, callback, debug) {

				var xhrs;
				
				// Combine the entities and then pluck the _fetch object
				xhrs = _.chain([entities]).flatten().pluck('_fetch').value();

				// Debug
				if (debug) {

					console.log('xhr:');
					console.log(xhrs);

				}
				
				// When the AJAX request is done call the callback
				return $.when.apply($.ajax, xhrs).done(callback).fail(function() {

					// Debug
					if (debug) {

						console.warn('AJAX call failed');

					}

				});
			
			});

			/**
			Show Panel
			@event show:panel
			@param targetPanel {String} Which panel to display in
			@param toDisplay {Object} Controller or view
			@param requestData {Object} Any data to add to the data request
			@param title {String} Title for the header section
			@param closable {Boolean} Is the panel closable by the user
			@param params {Object} Any params to feed into the controller / view
			*/
			Commands.setHandler('show:panel', function(options) {

				// Make options an empty object if not supplied
				options = options || {};

				// Set the option defaults
				_.defaults(options, {

					targetPanel: 'right',
					title: 'Corso',
					closable: true

				});

				var
				App = require('app'),
				appPanels = App.components.panels,
				panelWrapper = appPanels.$element,
				panel = panelWrapper.find('#panel-' + options.targetPanel),
				panelOpen = panel.attr('data-open') === 'true',
				targetRegion;

				/*
				Panel region
				*/

				// Which target panel has been supplied?
				switch(options.targetPanel) {

					case 'top':

						targetRegion = App.panels.currentView.panelTop;

						break;

					case 'right':

						targetRegion = App.panels.currentView.panelRight;

						break;

					case 'bottom':

						targetRegion = App.panels.currentView.panelBottom;

						break;

					case 'left':

						targetRegion = App.panels.currentView.panelLeft;

						break;

				}

				// Reset the panel region
				targetRegion.currentView.header.reset();
				targetRegion.currentView.content.reset();

				/*
				Panel header
				*/

				// Show the panel header
				targetRegion.currentView.header.show(new HeaderView({

					panelReference: options.targetPanel,
					close: options.closable,
					title: options.title

				}));

				/*
				Type control
				*/

				// Are we dealing with a controller?
				if (options.type === 'controller') {

					// Initialise the controller and supply the correct
					// region and display type
					var controller = new options.toDisplay({

						region: targetRegion.currentView.content,
						displayType: 'panel',
						data: options.data,
						dataId: options.dataId

					});

				}
				else {

					var entity = options.toDisplay.collection || options.toDisplay.model;

					// Is there anything to fetch?
					if (entity) {

						// Fetch the data via crudder
						entity.fetch({

							beforeSend: function() {

								// Show a loader in the panel
								targetRegion.currentView.content.show(new LoaderView({ loadingType: 'spinner' }));

							},
							success: function(response) {

								// Show the content in the panel
								targetRegion.currentView.content.show(options.toDisplay);

							}

						});

					}
					else {

						// Show the content in the panel
						targetRegion.currentView.content.show(options.toDisplay);

					}

				}

				// If panel is currently close
				if (!panelOpen) {

					// Show the panel via the jQuery plugin
					appPanels.clickEventHandler({

						panelReference: options.targetPanel

					});

				}

	        if (options.type === 'controller') {
	        	console.log(controller);
	        	return controller;
	        }

			});

			/**
			Close Panel
			@event close:panel
			@param targetPanel {String}
			*/
			Commands.setHandler('close:panel', function(options) {

				// Make options an empty object if not supplied
				options = options || {};

				// Set the option defaults
				_.defaults(options, {

					requestedPanel: $('.panel-right'),
					panelReference: 'right',
					panelType: 'horizontal',
					reset: true

				});

				var
				App = require('app'),
				appPanels = App.components.panels;

				// Close the panel via the jQuery plugin
				appPanels.closePanel(options);

			});

			/**
			Init hover
			@event init:hover
			@param toDisplay {Object} Controller or view
			@param requestData {Object} Any data to add to the data request
			@param title {String} Title for the header section
			@param params {Object} Any params to feed into the controller / view
			*/
			Commands.setHandler('init:hover', function(options) {

				// Make options an empty object if not supplied
				options = options || {};

				// Set the option defaults
				_.defaults(options, {

					interactive: true,
					interactiveTolerance: 1000,
					position: 'bottom',
					trigger: 'click'

				});

				// Do we want to display a view?
				if (options.type === 'view') {

					// console.log(options.toDisplay);
					var hoverWrapperView = Requests.request('get:hover:wrapper', options.toDisplay, options.config);

					// Render the hover wrapper layout
					hoverWrapperView.render();

					// When the close button in wrapper view is clicked
					options.toDisplay.on('close:hover', function() {

						// Hide the tooltip
						options.element.tooltipster('hide');

					});

					// Init the tooltip
					options.element.tooltipster({
						 
						 trigger: options.trigger,
						 interactive: options.interactive,
						 interactiveTolerance: options.interactiveTolerance,
						 position: options.position,
						 content: hoverWrapperView.$el
					
					});

				}
				else {

					// Init the tooltip
					options.element.tooltipster({
						 
						 trigger: options.trigger,
						 interactive: options.interactive,
						 interactiveTolerance: options.interactiveTolerance,
						 position: options.position,
						 content: $(options.toDisplay)
					
					});

				}

			});

			/**
			Update Header Suffix
			@event update:header:suffix
			@param suffix {String} The text to add to the module title
			*/
			Commands.setHandler('update:header:suffix', function(options) {

				var App = require('app');

				// Add suffix to module title
				App.main.currentView.content.currentView.header.currentView.title.currentView.model.set({

					titleSuffix: options.suffix

				});

			});

			/**
			Toggle Header Results Button
			@event toggle:header:results
			@param show {Boolean} Show the button or not
			*/
			Commands.setHandler('show:header:results', function(show) {

				var
				App = require('app'),
				targetButton = App.main.currentView.content.currentView.header.currentView.controls.currentView.ui.resultsButton;

				// Show or hide?
				if (show) {

					targetButton.show();

				}
				else {

					targetButton.hide();

				}

			});

			/**
			Toggle module wrapper
			@event toggle:module:wrapper
			@param fullWidth {Boolean} Full width wrapper or not
			*/
			Commands.setHandler('toggle:module:wrapper', function(options) {

				var
				App = require('app'),
				className = (options.fullWidth) ? 'fluid-wrapper' : 'fixed-wrapper';

				// Add suffix to module title
				App.main.currentView.ui.wrapper.attr('class', className);

			});

			Commands.setHandler('show:sieve', function(options) {

				var
				sieveController;

				options = options || {};

				if (options.hasOwnProperty('searchView')) {

					_.defaults(options, {

						config : {
							width : '80%',
							height : '80%'
						},
						viewConfig : {}

					});

					sieveController = new SieveController(options);

				} else {

					console.warn('A view needs to be supplied to the Corso Sieve.');

				}

			});

		}

	};

});