/**
jQuery - Toggle Wrapper
v1.0.0
*/

/*
Requires:
	* jQuery
*/

;(function ($, window, document, undefined) {

	$.fn.toggleWrapper = function(obj, init) {

		var
		that = this,
		bLogo = true;

		// If not obj is supplied
		if (obj == null) {

			obj = {};

		} else if (typeof obj == "object" && !(Array.isArray(obj))) {

			if (obj.hide) {

				this.addClass('hide');

			} 

			if (obj.noLogo) {

				bLogo = false;

			}

		}

		// If init has not been supplied
		if (init == null) {

			init = true; 

		}

		// If init is true
		if (init) {

			// Add relative positioning to the element
			this.addClass('relative');

			// Create a new div element
			var overlay = $('<div>');

			// Add the right classes and attributes
			overlay.addClass('overlay opacity').attr('data-wrapper', true).attr('z-index', '-1');

			// Append the overlay to the target element
			this.append(overlay);

			if (bLogo) {
				that.append('<div class="centered-text"><img id="mascotWait" src="../../../../imgs/system/mascotWait.gif"></img></div>');
				that.find('#mascotWait').css('height', '50%').css('width', '200px');
			}


			// console.log(this.height()/1.5);
			// console.log(this.width()/4);
			// console.log(this.offset().top);
			// console.log(this.height()/2);

		}
		else {

			// Remove the relative positioning
			this.removeClass('relative');
			this.find('#mascotWait').last().remove();
			
			// Remove the data wrapper
			this.find('[data-wrapper]').remove();
		
		}

	};

})(jQuery, window, document);