/**
Base Marionette Router
@module Base
@submodule Base.Marionette.Router
*/

/*
Requires:
	* Backbone
	* Marionette
	* jQuery
	* Underscore
Contents:
	* Base Router
		* before
		* after
		* getRouteParams
*/

define([

	'marionette',
	'app.vent',
	'commands/commands.vent',
	'requests/requests.vent'

], function(Marionette, Vent, Commands, Requests) {

	'use strict';

	/**
	Base Router
	@class SystemApp.Views.DetailLayout
	@constructor
	@extends Marionette.Layout
	*/
	return _.extend(Marionette.Module.prototype, {

	// Stop this module by running its finalizers and then stop all of
	// the sub-modules for this module
	stop : function() {

		// if we are not initialized, don't bother finalizing
		if (this._isInitialized){ 

			this._isInitialized = false;

			Marionette.triggerMethod.call(this, "before:stop");

			// stop the sub-modules; depth-first, to make sure the
			// sub-modules are stopped / finalized before parents
			_.each(this.submodules, function(mod){ mod.stop(); });

			// run the finalizers
			this._finalizerCallbacks.run(undefined,this);

			// reset the initializers and finalizers
			this._initializerCallbacks.reset();
			this._finalizerCallbacks.reset();

			if (this.controller) {

				delete this.controller;

			}

			Marionette.triggerMethod.call(this, "stop");

		}

	}

	});

});