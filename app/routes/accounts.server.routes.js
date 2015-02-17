// Invoke 'strict' JavaScript mode
'use strict';

// Load the module dependencies
var users = require('../../app/controllers/users.server.controller'),
	accounts = require('../../app/controllers/accounts.server.controller');

// Define the routes module' method
module.exports = function(app) {
	// Set up the 'accounts' base routes
	app.route('/api/accounts')
	   .get(accounts.list)
	   .post(users.requiresLogin, accounts.create);

	// Set up the 'accounts' parameterized routes
	app.route('/api/accounts/:accountId')
	   .get(accounts.read)
	   .put(users.requiresLogin, accounts.hasAuthorization, accounts.update)
	   .delete(users.requiresLogin, accounts.hasAuthorization, accounts.delete);

	// Set up the 'accountId' parameter middleware
	app.param('accountId', accounts.accountByID);
};
