/*
Application Config - Validation
@module Config
@submodule Config.Backbone.Validation
*/

/*
Requires:
	* jQuery
  * Backbone
  * Underscore
Contents:
*/

define([

  'backbone.validation'

], function(Validation) {

  'use strict';

  return {

		/**
		Module Initialize
		@method initialize
		*/
	initialize: function() {

		/**
		Backbone Validation
		@extends Backbone.Validation.callbacks
		*/
			_.extend(Backbone.Validation.callbacks, {

				/**
		@method valid
		*/
		valid: function(view, attr, selector) {

		 // Setup
		 var targetEl = this.setup(view, attr);

		 // Remove error styling from target input
		 targetEl.removeClass('error');
		 targetEl.addClass('margin-bottom');

		},
		
		/**
		@method invalid
		*/
		invalid: function(view, attr, error, selector) {

		 // Setup
		 var targetEl = this.setup(view, attr, selector);

		 // Add styling to the target input
		 targetEl.addClass('error');
		 targetEl.removeClass('margin-bottom');

		 // Add an error message
		 targetEl.after('<p class="form-error text-red">' + error + '</p>');

		 // Focus on the erroring input
		 targetEl.focus();
		
		},

		/**
		@method setup
		*/
		setup: function(view, attr, selector) {

		var target;

		 // Locate the target input
		 if(selector == 'class') {
			target = view.$el.find('.'+attr);
		 } else {
			target = view.$el.find('['+selector+'*=' + attr + ']');
		 }
		 

		 // Remove any previous error messages
		 target.next('.form-error').remove();

		 return target;

		}
			
			});

		}

	};

});