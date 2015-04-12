// Invoke 'strict' JavaScript mode
'use strict';

// Load the module dependencies
var users = require('../../app/controllers/users.server.controller'),
	brands = require('../../app/controllers/brands.server.controller'),
	locations = require('../../app/controllers/locations.server.controller');

// Define the routes module' method
module.exports = function(app) {
	// Set up the 'brands' base routes
	app.route('/api/brands')
		.get(brands.list)
//		.post(brands.create);
		.post(users.requiresLogin, brands.create);

app.route('/api/brands/active')
	.get(brands.listActiveBrands);

app.route('/api/brands/upload')
    .post(users.requiresLogin, brands.postImage);
//		.post(brands.postImage);

	// Set up the 'brands' parameterized routes
	app.route('/api/brands/:brandId')
		.get(brands.read)
		.put(users.requiresLogin, brands.hasAuthorization, brands.update)
		.delete(users.requiresLogin, brands.hasAuthorization, brands.delete);

	// Set up the 'brandId' parameter middleware
	app.param('brandId', brands.brandByID);
};
