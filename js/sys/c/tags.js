
/* Tags collection */

define([

  'backbone',
  'sys/m/tags',
  'backbone.pageable'

], function(Backbone, Model) {

  'use strict';


  return Backbone.Collection.extend({

    model: Model,

    url: 'z/ta/gs',

  });

});