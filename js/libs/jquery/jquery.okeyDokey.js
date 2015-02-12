/**
jQuery - Okey Dokey
v1.0.0
*/

/*
Requires:
  * jQuery
  * jquery.okeyDokey.css
Contents:
  * Plugin constructor
  * Plugin prototype
  	* init
  * Plugin wrapper
*/

/*
Usage:

Setup
$('body').okeyDokey({

  iconOk: '<i class="icon-ok"></i>',
  iconFail: '<i class="icon-cancel"></i>'.
  backgroundColor: '#000',
	okText: 'Success!',
	failText: 'Failed'

});

Trigger
$('body').trigger('okey:dokey');
$('body').trigger('not:okey:dokey');

*/

;(function ($, window, document, undefined) {

	// Create the defaults once
	var
	pluginName = 'okeyDokey',
	defaults = {

		element: 'body',
		heightLimit: 200,
		widthLimit: 200,
		backgroundColor: '#000',
		okText: 'Success!',
		failText: 'Failed'

	};

	/*
	Plugin constructor
	*/

	function Plugin(element, options) {

		this.element = element;
		this.$element = $(element);

		// future instances of the plugin
		this.settings = $.extend( {}, defaults, options );
		this._defaults = defaults;
		this._name = pluginName;

		// Resize event listener initial state 
		this.resizeInitialised = false,

		// Call the init method to start it all off
		this.init();

	}

	/*
	Plugin prototype
	*/

	Plugin.prototype = {

		/**
    @method init
    */
		init: function() {

			var
			_this = (_this !== undefined) ? _this : this,
			element = $(_this.element);

			// Add event listener
			element.on('okey:dokey', function(e) {

				// Show the ok message
				_this.isOkeyDokey();

			});

			// Add event listener
			element.on('not:okey:dokey', function(e) {

				// Show the ok message
				_this.isNotOkeyDokey();

			});

		},

		/**
    @method isOkeyDokey
    */
		isOkeyDokey: function() {

			// Create a new div
			var message = $('<div>').addClass('okey-dokey').append(this.settings.iconOk + this.settings.okText);

			// Display the message
			this.displayMessage(message);

		},

		/**
    @method isNotOkeyDokey
    */
		isNotOkeyDokey: function() {

			// Create a new div
			var message = $('<div>').addClass('okey-dokey').append(this.settings.iconFail + this.settings.failText);

			// Display the message
			this.displayMessage(message);

		},

		/**
    @method displayMessage
    */
		displayMessage: function(message) {

			// Append the el to the element
			this.$element.append(message);

			// Fade in the message, then fade out and remove
			message.fadeIn('slow').delay(600).fadeOut('slow', function() {

				message.remove();

			});

		}

	};

	/*
	Plugin wrapper
	*/

	// A really lightweight plugin wrapper around the constructor,
	// preventing against multiple instantiations
	$.fn[pluginName] = function(options) {

		return this.each(function() {

			if (!$.data(this, 'plugin_' + pluginName)) {

				$.data(this, 'plugin_' + pluginName, new Plugin(this, options));
			}

		});

	};

})(jQuery, window, document);
