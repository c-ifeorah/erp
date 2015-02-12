/**
Base Marionette View
@module Base
@submodule Base.Marionette.View
*/

/*
Requires:
  * Backbone
  * Marionette
  * jQuery
  * Underscore
Contents:
  * templateHelpers
    * formatDate
    * formatDateTime
    * fuzzyTime
  * addOpacityWrapper
*/

define([

  'marionette',
  'requests/requests.vent',
  'jquery.toggleWrapper',
  'jquery.okeyDokey'

], function(Marionette, Requests) {

  'use strict';

  return _.extend(Marionette.View.prototype, {

    /**
    @method initialize
    */
    initialize: function() {

      // Init Okey Dokey
      $('body').okeyDokey({

        iconOk: '<i class="icon-ok"></i>',
        iconFail: '<i class="icon-cancel"></i>'

      });

    },

    /**
    @method templateHelpers
    @param add {Boolean} Add or remove the wrapper
    */
    addOpacityWrapper: function(options) {

      options = options || {};

      // We require a true or false for 'add'
      if (_.isBoolean(options.add)) {
        
        // Add a toggle wrapper to this view
        this.$el.toggleWrapper({
        
          className: 'opacity'
        
        }, options.add);
      
      }
      else {

        console.warn('Opacity wrapper requires an add parameter');

        return;

      }
    
    },

    /**
      @method killEvent
      Call in the events hash when clicking a button within the form, kills the event within its' tracks and stops the page refreshing 
    */
    killEvent : function(e) {
     var 
     prevent = e.preventDefault,
     stop = e.stopPropagation;

     prevent ? e.preventDefault.apply(e) : false;
     stop ? e.stopPropagation.apply(e) : false;
    },

	});

});



/**
    @property templateHelpers
    @type Object
    */
    // templateHelpers: function() {
      
      // return {

        /**
        @method formatDate
        @param date {Date} The date to be formatted
        @param format {Date} The format of the date to be formatted
        
        formatDate: function(date, format) {

          var formattedDate;

          // Validate date value
          if (new Moment(date).isValid()) {

            // Request a formatted date
            formattedDate = Requests.request('get:formatted:date', {

              date: date,
              format: format

            });

          }
          else if (new Moment(format).isValid()) {

            // Request a formatted date
            formattedDate = Requests.request('get:formatted:date', {

              date: format

            });

          }
          else {

            return '';

          }

          return formattedDate;
          
        },*/

        /**
        @method formatDateTime
        @param date {Date} The date to be formatted
        @param format {Date} The format of the date to be formatted
        
        formatDateTime: function(date, format) {

          // Request a formatted date
          var formattedDateTime = Requests.request('get:formatted:date', {

            date: date,
            format: Requests.request('get:state:data').get('dateTimeFormat')

          });

          return formattedDateTime;
          
        },*/

        /**
        @method fuzzyTime
        @param date {Date} The date to be formatted
        
        fuzzyTime: function(date) {

          // Request a formatted date
          var fuzzyTime = Requests.request('get:fuzzy:time', {

            date: date

          });

          return fuzzyTime;
          
        },*/

        /* What dis???
        linkTo: function(name, url, options) {

          if (options === null) {
            
            options = {};
          
          }

          _.defaults(options, {
            
            external: false
          
          });
          
          if (!options.external) {
            
            url = "#" + url;
          
          }
          
          return "<a href='" + url + "'>" + (this.escape(name)) + "</a>";
        
        },*/

      // };

    // },