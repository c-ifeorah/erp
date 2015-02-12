/**
Base Marionette Controller
@module Base
@submodule Base.Marionette.Controller
*/

/*
Requires:
	* Backbone
  * jQuery
  * Underscore
  * Marionette
  * Crudder
Contents:
  * initialize
  * show
  * save
  * close
  * showHeader
*/

define([

	'marionette',
	'commands/commands.vent',
	'components/loader/loader.controller',
  'm/z/system.rolePrivileges.m',
  'components/header/header.controller',
  'v/z/system.blank.v'

], function(Marionette, Commands, LoaderController, PrivilegesModel, HeaderController, EmptyView) {

  'use strict';

  return _.extend(Marionette.Controller.prototype, {

    /**
    @method initialize
    @param route {String} Route for the 'homepage'
    */
    initialize: function(options) {

      // Add a unique id to the controller
      this._instance_id = _.uniqueId('controller');

      // Register the controller
			// Commands.execute('register:instance', this, this._instance_id

    },

    /**
    @method show
    */
    show: function(options) {

      var App = require('app');

      // options are not required
      options = options || {};
     
      // Defaults
      _.defaults(options, {

        entities: undefined,
        loader: false,
        closeSectionHeader: true,
        defaultOpacityTarget: false

      });

      var
      view = options.view || this.layout || this.view,
      region = options.region || this.region || App.main,
      entities = (options.entities) ? options.entities : this.collection || this.model,
      ctr = options.ctr,
      mascotView,
      bFetched = false;

      if (!(ctr) || ctr.privUrl !== undefined) {

        if (ctr) {

          ctr.rolePrivs = new PrivilegesModel({ url : ctr.privUrl });
          ctr.rolePrivs.fetch();

          if (Array.isArray(entities)) {

            entities.push(ctr.rolePrivs);

          } else {

            entities = [entities, ctr.rolePrivs];

          }

        }

        // debug mode
        if (options.debug) {

          console.log('view:');
          console.log(view);
          console.log('region:');
          console.log(region);
          console.log('entities:');
          console.log(entities);

        }

        // Listen to the main layout 'close' event
        this.listenTo(view, 'close', function() {

          // debug mode
  				if (options.debug) {
          
           console.log('controller closed');

          }
          
          // Close the controller of the closed view
          this.close();

        });

        // if loader is requested
        if (options.loader) {

          /*
          Loader
          */

          // Show the loader
          // var loaderController = new LoaderController({

          //   view: view,
          //   region: region,
          //   entities: entities,
          //   loadingType: options.loadingType,
          //   closeSectionHeader: options.closeSectionHeader,
          //   defaultOpacityTarget: options.defaultOpacityTarget,
          //   debug: false

          // });
    
          mascotView = new EmptyView({

            template : $('<div></div>').append(' ')

          });

          region.show(mascotView);

          mascotView.render();

          mascotView.$el.toggleWrapper({

            className : 'opacity',
            hide : true

          }, true);

          setTimeout(function() {

            if (!(bFetched)) {

              mascotView.$el.fadeIn(500, 'swing');

            }

          }, 1500);

          Commands.execute('when:fetched', entities, function() {

            bFetched = true;

            mascotView.$el.fadeOut(500, 'swing', function() {

              mascotView.$el.toggleWrapper({

                className : 'opacity'

              }, false);

              // Show the view in the main region
              region.show(view);

            });

          });

       }
       else {

          // Show the view in the main region
          region.show(view);
         
        }

      } else {

        throw "Error : A 'privUrl' property must be defined for the controller.";

      }

    },

    /**
    @method close
    */
    close: function() {

      // Delete the controller region
      delete this.region;

      // Delete the controller layout
      delete this.layout;

      // Delete the controller view
      delete this.view;

      // Delete the controller options
      delete this.options;

      /*
			No Super :-(
      */

      this.stopListening();
      this.triggerMethod('close');
      this.unbind();
      
      // Unregister the controller
      // Commands.execute('unregister:instance', this, this._instance_id);

    },

    /**
    Show the header
    @method header
    */  
    header: function(options) {

      var App = require('app');

      // We need options even if none are supplied
      options = options || {};

      // Set defaults
      _.defaults(options, {

        title: 'Corso',
        titleSuffix: false,
        subTitle: false,
        icon: false,
        reference: false,
        controlsView: false,
        controls: false,
        search: false,
        combo: false,
        add: false,
        results: false,
        region: this.layout.header || options.header  // App.main.currentView.header 

      });

      // We require a header region
      if (options.region) {

        // Create a new header controller
        return new HeaderController(options);

      }
      else {

        console.warn('There is no header region for this controller');

        return;

      }

    }

  });

});



/**
    Show the header
    @method showHeader
    @param title {String} The section title
    @param subtitle {String} Sub title view
  */  
    // showHeader: function(options) {

    //   // options are not required
    //   options = options || {};

    //   _.defaults(options, {

    //     title: '',
    //     icon: false,
    //     subtitle: false,
    //     controls: false

    //   });

    //   // New header model
    //   var headerModel = new HeaderModel({

    //     title: options.title,
    //     logo: options.logo,
    //     subtitle: options.subtitle,
    //     controls: options.controls

    //   });

    //   // Execute the section header command
    //   Commands.execute('show:section:header', {

    //     model: headerModel

    //   });

    // }

/**
    @method save
    */
    // save: function(options) {

    //   var App = require('app');

    //   // options are not required
    //   options = options || {};

    //   // Defaults
    //   _.defaults(options, {

    //     entities: undefined,
    //     loader: true,
    //     closeSectionHeader: true,
    //     defaultOpacityTarget: false

    //   });

    //   var
    //   view = options.view || this.layout || this.view,
    //   region = options.region || this.region || App.main,
    //   entities = (options.entities) ? options.entities : this.collection || this.model;

    //   // debug mode
    //   if (options.debug) {

    //     console.log('view:');
    //     console.log(view);
    //     console.log('region:');
    //     console.log(region);
    //     console.log('entities:');
    //     console.log(entities);

    //   }

    //   // if loader is requested
    //   if (options.loader) {

    //     // Show the loader
    //     var loaderController = new LoaderController({

    //       view: view,
    //       region: region,
    //       entities: entities,
    //       loadingType: 'opacity',
    //       defaultOpacityTarget: true,
    //       debug: false

    //     });

    //   }
    //   else {

    //     // Show the view in the main region
    //     return;
        
    //   }

    // },