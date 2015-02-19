// Invoke 'strict' JavaScript mode
'use strict';

// Load the module dependencies
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

// Define a new 'AccountSchema'
var AccountSchema = new Schema({
	createdOn: {
		type: Date,
		default: Date.now
	},
	name: {
		type: String,
		default: '',
		trim: true,
		required: 'Name cannot be blank'
	},
	status: { type: String, default: 'active'}
	}, { collection : 'accounts' });

// Create the 'Account' model out of the 'AccountSchema'
mongoose.model('Account', AccountSchema);
