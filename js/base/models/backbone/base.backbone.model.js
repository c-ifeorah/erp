/**
Base Backbone Model
@module Base
@submodule Base.Backbone.Model
*/

/*
Requires:
	* Backbone
	* jQuery
	* Underscore
Contents:
	* initialize
	* parse
	* _setOriginalAttributes
	* reset
*/

define([

	'backbone'

], function(Backbone) {

	'use strict';

	return _.extend(Backbone.Model.prototype, {

		/**
		@method initialize
		*/
		initialize: function(options) {

			options = options || {};

			// Set the original model attributes
			this._setOriginalAttributes();

			// Set any options
			this.options = options;

			return this;

		},

		/**
		@method parse
		@param response {Object} The response from the server
		*/
		parse: function(response) {

			// Is this an official API response?
			if (response.data) {

				// Return the API data
				return response.data;

			}
			else {

				// Return the raw json
				return response;
				
			}

		},

		/**
		@method _setOriginalAttributes
		*/
		_setOriginalAttributes: function() {

			// Set the original model attributes to use in reset method
			this._originalAttributes = this.toJSON();

			return this;

		},

		/**
		@method reset
		*/
		reset: function() {
			
			// Reset the model attributes to their initial value
			this.set(this._originalAttributes);

			return this;
		
		},

		/**
		@method unsetMultiple
		WB - unsets multiple attributes at once, accepts an array
		*/
		unsetMultiple : function(aAttrs) {
			for (var i = 0; i < aAttrs.length; i++) {
				this.unset(aAttrs[i]);
			}

			return this;
		}

	});

});