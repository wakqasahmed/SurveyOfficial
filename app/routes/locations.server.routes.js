// Invoke 'strict' JavaScript mode
'use strict';

// Load the module dependencies
var users = require('../../app/controllers/users.server.controller'),
	locations = require('../../app/controllers/locations.server.controller');

// Define the routes module' method
module.exports = function(app) {
	// Set up the 'locations' base routes
	app.route('/api/locations')
	   .get(locations.list)
			.post(locations.create);
//	   .post(users.requiresLogin, locations.create);

app.route('/api/locations/active')
	.get(locations.listActiveLocations);

//to use in Reports and Delete function of individual brands to get Locations By Brand Ids (array comma separated)
app.route('/api/locations/locationsByBrands/:brandIds')
		.get(locations.byBrands);

	// Set up the 'locations' parameterized routes
	app.route('/api/locations/:locationId')
	   .get(locations.read)
//	   .put(users.requiresLogin, locations.hasAuthorization, locations.update)
			.put(locations.update)
	   .delete(users.requiresLogin, locations.hasAuthorization, locations.delete);

	// Set up the 'locationId' parameter middleware
	app.param('locationId', locations.locationByID);
};
