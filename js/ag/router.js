/**
Author: MI
Description: Reouter specifying the approutes and handle for the module
Used in: Client Module
*/
define([
  'marionette'

], function(Marionette) {
  'use strict';

  return Marionette.AppRouter.extend({
    appRoutes: {
      'ag': 'getClients',
      'ag/:idClient': 'getClients'
    }
  });
});