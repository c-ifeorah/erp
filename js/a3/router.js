/**
Author: MI
Description: Router specifying the approutes and handle for the Meenu System module
Used in: MenuSystem Module
*/
define([
  'marionette'

], function(Marionette) {
  'use strict';

  return Marionette.AppRouter.extend({
    appRoutes: {
      'a3': 'getMenu'
    }
  });
});