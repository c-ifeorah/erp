/**
Author: MI 
Description: Collection of all tags specifying the model
Used in: Controller
*/
define([
  'backbone',
  'a1/m/admin',  // defining the model to be used to populate the collection
  'backbone.pageable'

], function(Backbone, Model) {
  'use strict';

  return Backbone.PageableCollection.extend({
    mode: 'client',
    url: 'a/ad/min',
    model: Model
  }); 
});