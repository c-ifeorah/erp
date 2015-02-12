/**
Author: MI
Description: Reouter specifying the approutes and handle for the module
Used in: Admin Module
*/
define([
  'marionette'

], function(Marionette) {
  'use strict';

  return Marionette.AppRouter.extend({
    appRoutes: {
      'a1': 'getTags'
    }
  });
});