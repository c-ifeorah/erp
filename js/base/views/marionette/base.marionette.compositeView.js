/**
Base Marionette Composite View
@module Base
@submodule Base.Marionette.CompositeView
*/

/*
Requires:
  * Backbone
  * Marionette
  * jQuery
  * Underscore
Contents:
  *
*/

define([

  'marionette'

], function(Marionette) {

  'use strict';

  return _.extend(Marionette.CompositeView.prototype, {

		/**
    @property isEmpty
    @type Function
    */
    isEmpty: function(collection) {

      var isEmpty = false;

      // Is the collection empty?
      if (collection.length === 0) {

        isEmpty = true;

        // Remove the table
        this.$el.find('.view-container').remove();

        // Set a new item view container
        this.itemViewContainer = '#empty-view-container';

      }
      else {

        // Remove the empty view container
        this.$el.find('#empty-view-container').remove();

      }

      return isEmpty;

    },

    /**
    @method sortList
    */
    sortList: function(e) {

      var
      targetEl = $(e.currentTarget),
      direction = targetEl.attr('data-direction');

      // Set the correct direction value
      targetEl.attr('data-direction', (direction === 'desc') ? 'asc' : 'desc');

      // Trigger the sorting event and send in the sort by value
      this.trigger('paging:sort', {

        key: targetEl.attr('data-key'),
        direction: (direction === 'asc') ? -1 : 1

      });

      e.preventDefault();

    }

	});

});