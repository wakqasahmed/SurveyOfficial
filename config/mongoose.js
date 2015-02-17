// Invoke 'strict' JavaScript mode
'use strict';

// Load the module dependencies
var	config = require('./config'),
	mongoose = require('mongoose'),
  autoIncrement = require('mongoose-auto-increment');

// Define the Mongoose configuration method
module.exports = function() {
	// Use Mongoose to connect to MongoDB
	var db = mongoose.connect(config.db);
			autoIncrement.initialize(db);

	// Load the application models
	require('../app/models/user.server.model');
	require('../app/models/account.server.model');
	require('../app/models/article.server.model');
	require('../app/models/location.server.model');
	require('../app/models/brand.server.model');
	require('../app/models/validation.server.model');
	require('../app/models/survey.server.model');
	require('../app/models/response.server.model');

	// Return the Mongoose connection instance
	return db;
};
