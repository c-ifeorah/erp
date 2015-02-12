/**
Base Marionette Collection View
@module Base
@submodule Base.Marionette.CollectionView
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

  return _.extend(Marionette.CollectionView.prototype, {

		itemViewEventPrefix: 'childview'

	});

});