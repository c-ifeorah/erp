/*
Application Config - Sync
@module Config
@submodule Config.Backbone.Sync
*/

/*
Requires:
	* jQuery
  * Backbone
  * Underscore
Contents:
*/

define([

  'backbone'

], function(Backbone) {

  'use strict';

  return {

		/**
		Module Initialize
		@method initialize
		*/
    initialize: function() {

      var
      App = require('app'),
      methods,
      _sync;

      // Backup the original Backbone.sync
      _sync = Backbone.sync;

      Backbone.sync = function(method, entity, options) {

        var sync;

        options = options || {};

        // Bind ajax events to the entity
        _.defaults(options, {

          beforeSend: _.bind(methods.beforeSend, entity),
          complete: _.bind(methods.complete, entity)
        
        });

        // Attach the xhr (_sync) object
        sync = _sync(method, entity, options);

        // If entity doesn't have the _fetch property and method is 'read'
        if (!entity._fetch && method === 'read') {

          // Set the _fetch property to the xhr event
          entity._fetch = sync;

          return;
        
        }

      };

      methods = {

        beforeSend: function() {
          
          // Use this to disable forms before sync
          this.trigger('sync:start', this);
        
        },

        complete: function() {
          
          // Use this to enable disabled forms after sync
          this.trigger('sync:stop', this);
        
        }

      };

		}

	};

});