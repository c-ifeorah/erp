/**
Initialise all App requests
@module Requests
@submodule Requests.Init
*/

/*
Requires:
	* jQuery
  * Backbone
  * Marionette
  * Underscore
  * Requests
Contents:
  * Module Initialize
		* Initialise all the required requests
*/

define([

	'marionette',
	'requests/requests.vent',
	'components/pagination/pagination.controller',
	'components/form/form.controller',
	'components/hover/hover.controller',
	'ctr/z/system.buttons',
  	'components/journeyBoard/journeyBoard.controller',
  	'components/buttonRegion/ctr/main',
	'components/panels/views/panels.views.header',
	'components/loader/loader.view'

], function(Marionette, Requests, PaginationController, FormController, HoverController, ButtonController, JourneyBoard, ButtonRegion, HeaderView, LoaderView) {

  'use strict';

  return {

		/**
		Module Initialize
		@method initialize
		*/
    initialize: function() {

			/**
			Get the current module name
			@event get:current:module:name
			@return {String} Current get:current:module:name
			*/
			Requests.setHandler('get:current:module:name', function() {

				// Return the current module name
				return window.location.hash.substr(1,2);

			});


			/**
			Get pagination wrapper
			@event get:pagination:wrapper
			@return {Object} The pagination layout to display
			*/
			Requests.setHandler('get:pagination:wrapper', function(contentView, options) {

				// Do we have options?
				if (options === null || options === undefined) {

					options = {};
				
				}

				// Is there a collection in the view?
				if (!contentView.collection) {
        
					throw new Error('No collection found inside of pagination\'s contentView');

				}

				// Create our form controller
				var paginationController = new PaginationController({

					view: contentView,
					config: options

				});
				
				// Return the form layout
				return paginationController.paginationLayout;

			});

			/**
			Get form wrapper
			@event get:change:status
			@return {Object} The form layout to display
			*/
			Requests.setHandler('get:form:wrapper', function(contentView, options) {

				// Do we have options?
				if (options === null) {

					options = {};
				
				}

				// Is there a model in the view?
				if (!contentView.model) {
        
					throw new Error('No model found inside of form\'s contentView');

				}

				// Create our form controller
				var formController = new FormController({

					view: contentView,
					config: options

				});
				
				// Return the form layout
				return formController.formLayout;

			});

			/**
			Button Region
			*/
			Requests.setHandler('get:button:region', function(options) {

				var buttonRegion = new ButtonRegion(options);
				
				return buttonRegion.view;

			});

			/**
			Get hover wrapper
			@event get:change:status
			@return {Object} The hover layout to display
			*/
			Requests.setHandler('get:hover:wrapper', function(contentView, options) {

				// Do we have options?
				if (options === null) {

					options = {};
				
				}

				// Create our form controller
				var hoverController = new HoverController({

					view: contentView,
					config: options

				});
				
				// Return the form layout
				return hoverController.hoverLayout;

			});

			/**
			Get form buttons
			@event form:button:entities
			@return {Object} Button controller
			*/
			Requests.setHandler('form:button:entities', function(buttons, model) {
				
				// Do we have buttons?
				buttons = buttons || {};

				// Create our new button controller and return our buttons
				return new ButtonController().getFormButtons(buttons, model);
			
			});

			/**
			Get buttons
			@event button:entities
			@return {Object} Button controller
			*/
			Requests.setHandler('button:entities', function(buttons, model) {
				
				// Do we have buttons?
				buttons = buttons || {};

				// Create our new button controller and return our buttons
				return new ButtonController().getButtons(buttons, model);
			
			});

			/**
			Get logged in user
			@event get:session:user
			@return {Object} Button controller
			*/
			Requests.setHandler('get:session:user', function(buttons, model) {

				var App = require('app');

				// Create our new button controller and return our buttons
				return App.session;
			
			});

			Requests.setHandler('get:journey:board', function(options) {


				var journeyBoard = new JourneyBoard(options);
				
				// Return the form layout
				return journeyBoard;

			});

			Requests.setHandler('get:modal:region', function(options) {

				function adjustModalSize(options) {

					var
					that = this,
					oCss = {};

					if (options.config.height.indexOf('%') != -1) {
						oCss.height = (parseInt($('#page-module-content').css('height'))/100)*parseInt(options.config.height)+'px';
					}

					if (options.config.width.indexOf('%') != -1) {
						oCss.width = (parseInt($('#page-module-content').css('width'))/100)*parseInt(options.config.width)+'px';
					}

					oCss.left = (parseInt($('#page-module-content').css('width'))-parseInt(oCss.width))/2+'px';

					oCss.top = (parseInt($('#page-module-content').css('height'))-parseInt(oCss.height))/2+'px';

					$('#modal-window').css('width', oCss.width).css('min-height', oCss.height).css('top',  oCss.top).css('left', oCss.left);
				}

				if (options && options.config && options.config.height && options.config.width) {
					adjustModalSize(options);

					$(window).resize(function() {
						adjustModalSize(options);
					});
				}

				if (options && options.regions) {
					$('#modal-window').show();
					$('#modal-header').show();
					$('#page-main').toggleWrapper({ noLogo : true }, true);

					$('#close-modal').click(function() {
						$('#modal-window').hide();
						$('#page-main').toggleWrapper({ noLogo : true }, false);
					});

					return {
						modal : new Marionette.Region({ el : $('#modal-window') }),
						header : new Marionette.Region({el : $('#modal-header')}),
						main : new Marionette.Region({el : $('#modal-main')}),
						footer : new Marionette.Region({el : $('#modal-footer')})
					};


					new Marionette.Region({
						el : $('#modal-main')
					});
				} else {
					$('#modal-header').hide();
					return {
						modal : new Marionette.Region({ el : $('#modal-window') }),
						main : new Marionette.Region({ el : $('#modal-main') })
					};
				}

			});

    }

  };

});