// Invoke 'strict' JavaScript mode
'use strict';

// Load the module dependencies
var users = require('../../app/controllers/users.server.controller'),
	brands = require('../../app/controllers/brands.server.controller');

// Define the routes module' method
module.exports = function(app) {
	// Set up the 'brands' base routes
	app.route('/api/brands')
		.get(brands.list)
		.post(users.requiresLogin, brands.create);

	// Set up the 'brands' parameterized routes
	app.route('/api/brands/:brandId')
		.get(brands.read)
		.put(users.requiresLogin, brands.hasAuthorization, brands.update)
		.delete(users.requiresLogin, brands.hasAuthorization, brands.delete);

	// Set up the 'brandId' parameter middleware
	app.param('brandId', brands.brandByID);
};
