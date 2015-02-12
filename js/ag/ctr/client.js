/**
Author: MI 
Description: Client Controller for each Client
Used in: Clients Module
*/
define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'commands/commands.vent',
	'requests/requests.vent',
	'ag/m/client',		// Defining the model that would be edited
	'ag/l/client',		// Defining the layout of the Client form
	'ag/v/client',		// Defining the form view of the selected client
	'corso',
	'backbone.validation'

], function($, _, Backbone, Marionette, Commands, Requests, Model, Layout, FormView, Corso) {
	'use strict';

	return Marionette.Controller.extend({
		initialize: function(options) {
			var that = this;
			// Has a model been supplied?
			if (options.model) {
				// Define our client model
				this.model = options.model;
				// Show the results button
				Commands.execute('toggle:header:results');
			}
			else {
				// We need a new model
				this.model = new Model({
					Passport: options.Passport
				});
				// Request for the client
				this.model.fetch();
			}

			// Define the main view
			this.layout = new Layout();
			// Define the main region
			this.region = options.region;
			// Collections object
			this.collections = {};

			// Listen for the main layout's 'show' event
			this.layout.on('show', function() {
				// Show the form view
				that.showForm();
				that.trigger("update:toolbar", that.model);
			});

			this.show({
				loader: true,
				entities: [this.model],
				debug: false
			});
		},

		// Function to control all the contents displayed for each selected client
		showForm: function(toolbarView) {
			var
			that = this,
			// Create the new form view
			formView = new FormView({
				model: this.model,
				toolbarView: toolbarView
			}),
			// We need form component
			formWrapperView = Requests.request('get:form:wrapper', formView);

			// Listen for the view render event
			formView.on('render', function() {				
				// Bind validation to the form view
				Backbone.Validation.bind(this);
			});

			// Listening to the remove event for each model
			formView.on('client:ask:delete', function() {
				that.layout.ui.clientDeleteInfo.text(' Are you sure you wish to delete client ' + this.model.get('Name') +  '?');
				that.layout.ui.clientDeleteDiv.show();
			});

			// When user clicks OK to delete
			this.layout.on('client:destroy', function() {
				// Delete the model
				formView.model.destroy({
					wait: true,
					data: JSON.stringify(formView.model),	//	Sending Delete request with the data

					success: function() {
						// Trigger an okey dokey message
						$('body').trigger('okey:dokey');
						// Navigate back to list
						Commands.execute('app:navigate', {
							route: 'ag'
						});
					},

					error: function() {
						// Trigger a not okey dokey message
						$('body').trigger('not:okey:dokey');
					}
				});
				that.layout.ui.clientDeleteDiv.hide();
			});

			// When user clicks Cancel delete
			this.layout.on('client:cancel:destroy', function() {
				that.layout.ui.clientDeleteDiv.hide();
			});

			// When user clicks Save
			formView.on('client:save', function() {
				var view = this;
				this.model.set({Name: this.$el.find('#client-name').val(), SubDomain: this.$el.find('#client-subdomain').val(), emailAddress: this.$el.find('#client-email').val(), username: String(Math.random()).replace('0.', '')				//	Setting up attribute values for the model on save and send to the server
				})
				// Save the model
				this.model.save(null, {
					wait: true,

					beforeSend: function() {
						// Add an opacity wrapper
						formWrapperView.$el.toggleWrapper({
							className: 'opacity'
						}, true);
					},

					success: function(data) {
						// Trigger an okey dokey message
						$('body').trigger('okey:dokey');
						// Remove the opacity wrapper
						formWrapperView.$el.toggleWrapper({
							className: 'opacity'
						}, false);
						view.render();	// Automatically re render the view
						formView.model.set({Passport: data.Passport});	// Set the new Clients Passport
						that.trigger("update:toolbar", that.model);		// Update the toolbar with the new CLient
					},

					error: function() {
						// Trigger a not okey dokey message
						$('body').trigger('not:okey:dokey');
						// Remove the opacity wrapper
						formWrapperView.$el.toggleWrapper({
							className: 'opacity'
						}, false);
					}
				});
			});
			// Show the form view in the form region
			that.layout.form.show(formWrapperView);
		},
	});
});