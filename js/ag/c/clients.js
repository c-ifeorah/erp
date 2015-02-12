/**
Author: MI 
Description: Collection of all Clients specifying the model
Used in: Clients Controller
*/
define([
  'backbone',
  'ag/m/client',  // defining the model to be used to populate the collection
  'backbone.pageable'

], function(Backbone, Model) {
  'use strict';

  return Backbone.PageableCollection.extend({
    mode: 'client',
    state: {
      pageSize: 5, // Items per page
      sortKey: 'Name',
      order: -1
    },
    url: 'a/cli/ent',
    model: Model
  });
});