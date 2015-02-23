// Invoke 'strict' JavaScript mode
'use strict';

// Load the module dependencies
var users = require('../../app/controllers/users.server.controller'),
	responses = require('../../app/controllers/responses.server.controller');

// Define the routes module' method
module.exports = function(app) {
	// Set up the 'responses' base routes
	app.route('/api/responses')
	   .get(responses.list)
	   .post(users.requiresLogin, responses.create);

app.route('/api/device/responses')
		.post(responses.create);

	// Set up the 'responses' parameterized routes
	app.route('/api/responses/:responseId')
	   .get(responses.read)
	   .put(users.requiresLogin, responses.hasAuthorization, responses.update)
	   .delete(users.requiresLogin, responses.hasAuthorization, responses.delete);

	// Set up the 'responseId' parameter middleware
	app.param('responseId', responses.responseByID);
};
