/* Filename: main.js
 * Owner: Corso Plc
 */

require.config({
  urlArgs: 'bust=' + (new Date()).getTime(),
  waitSeconds: 0,
  paths: {
    t: '../t', 
    text: 'libs/text/text',
    jquery: 'libs/jquery/jquery-min',
    underscore: 'libs/underscore/underscore',
    backbone: 'libs/backbone/backbone',
    marionette: 'libs/marionette/backbone.marionette',
    tpl: 'libs/require/tpl',
    // cGrid: 'v/z/system.cGrid.v',
    'bootstrap.dropdown': 'libs/bootstrap/dropdown',
    'bootstrap.tab': 'libs/bootstrap/bootstrap-tab',
    'bootstrap.tabdrop': 'libs/bootstrap/bootstrap-tabdrop',
    'bootstrap.buttons': 'libs/bootstrap/button',
    // 'tabs': 'libs/jquery/easyResponsiveTabs',
    'backbone.syphon': 'libs/backbone/backbone.syphon',
    'backbone.pageable': 'libs/backbone/backbone-pageable.min',
    'backbone.validation': 'libs/backbone/backbone-validation-amd',
    'backbone.mutators': 'libs/backbone/backbone.mutators.min',
    'jquery.okeyDokey': 'libs/jquery/jquery.okeyDokey',
    'jquery.toggleWrapper': 'libs/jquery/plugins/jquery.toggleWrapper',
    'jquery.panels': 'libs/jquery/plugins/jquery.panels',
    'jquery.tooltipster': 'libs/jquery/plugins/jquery.tooltipster.min',
    // 'jquery.typeahead': 'libs/jquery/plugins/typeahead.jquery.min',
    spin: 'libs/spin/spin.min',
    'jquery.spin': 'libs/spin/jquery.spin',
    'slimmenu': 'libs/slimmenu/jquery.slimmenu',
    // trello: 'v/z/system.trello',
    // goJS: 'libs/gojs/go',
    wysihtml5: 'libs/wysihtml5/wysihtml5-0.3.0.min',
    wysihtml5rules: 'libs/wysihtml5/advanced'
  },

  shim: {
    jquery: {
      exports: 'jQuery'
    },

    underscore: {
      exports: '_'
    },

    backbone: {
      deps: ['jquery', 'underscore'],
      exports: 'Backbone'
    },

    marionette: {
      deps: ['backbone'],
      exports: 'Marionette'
    },

    'bootstrap.dropdown': {
      deps: ['jquery']
    },

    'bootstrap.tab': {
      deps: ['jquery']
    },

    'bootstrap.buttons': {
      deps: ['jquery']
    },

    'bootstrap.tabdrop': {
      deps: ['bootstrap.tab', 'bootstrap.dropdown']
    },

    'backbone.pageable': {
      deps: ['backbone']
    },

    'backbone.syphon': {
      deps: ['backbone']
    },
    
    'backbone.validation': {
      deps: ['backbone']
    },
    
    'backbone.mutators': {
      deps: ['backbone']
    },
    
    'jquery.okeyDokey': {
      deps: ['jquery']
    },
    
    'jquery.toggleWrapper': {
      deps: ['jquery']
    },
    
    'jquery.panels': {
      deps: ['jquery']
    },
    
    'jquery.tooltipster': {
      deps: ['jquery']
    },
    
    'slimmenu': {
      deps: ['jquery']
    },
    
    'wysihtml5rules': {
      deps: ['wysihtml5']
    },
    
    'libs/jquery/UI/jquery.ui.core.min' : {
      deps: ['jquery']
    },
    
    'libs/jquery/UI/jquery.ui.widget.min' : {
      deps: ['libs/jquery/UI/jquery.ui.core.min']
    },
    
    'libs/jquery/UI/jquery.ui.mouse.min' : {
      deps: ['libs/jquery/UI/jquery.ui.widget.min']
    },
    
    'libs/jquery/UI/touch.punch'  : {
      deps: ['libs/jquery/UI/jquery.ui.mouse.min']
    },
    
    'libs/jquery/UI/jquery.ui.sortable.min' : {
      deps: ['libs/jquery/UI/touch.punch']
    },
    
    'libs/jquery/UI/jquery.ui.slider.min' : {
      deps: ['libs/jquery/UI/jquery.ui.mouse.min']
    },
    
    'libs/jquery/selectToUISlider' : {
      deps: ['libs/jquery/UI/jquery.ui.slider.min']
    }

  }
});

require([
  'app'
], function(App) {
  App.start(); // Start the application
});
