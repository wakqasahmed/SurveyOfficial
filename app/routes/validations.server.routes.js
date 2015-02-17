// Invoke 'strict' JavaScript mode
'use strict';

// Load the module dependencies
var users = require('../../app/controllers/users.server.controller'),
	validations = require('../../app/controllers/validations.server.controller');

// Define the routes module' method
module.exports = function(app) {
	// Set up the 'validations' base routes
	app.route('/api/validations')
	   .get(validations.list)
	   .post(users.requiresLogin, validations.create);

	// Set up the 'validations' parameterized routes
	app.route('/api/validations/:validationId')
	   .get(validations.read)
	   .put(users.requiresLogin, validations.hasAuthorization, validations.update)
	   .delete(users.requiresLogin, validations.hasAuthorization, validations.delete);

	// Set up the 'validationId' parameter middleware
	app.param('validationId', validations.validationByID);
};
