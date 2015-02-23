// Invoke 'strict' JavaScript mode
'use strict';

// Load the module dependencies
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	autoIncrement = require('mongoose-auto-increment');

var statuses = 'active inactive'.split(' ');

var contactPersonSchema = new Schema({
	name: String,
	email: String,
	phoneOffice: String,
	phoneCell: String
});

// Define a new 'AccountSchema'
var accountSchema = new Schema({
	name: {
		type: String,
		default: '',
		trim: true,
		required: 'Account Name cannot be blank'
	},
	status: { type: String, enum: statuses, "default": 'active' },
	country: String,
	state: String,
	postalCode: String,
	dealer: String,
	salesOrderNo: Number,
	contactDetails: [contactPersonSchema],
	createdOn: { type: Date },
	modifiedOn: { type: Date, default: Date.now }
	}, { collection : 'accounts' });

accountSchema.plugin(autoIncrement.plugin, {
		model: 'Account',
		field: 'accountNo',
		startAt: 1,
		incrementBy: 1
});

// Create the 'Account' model out of the 'AccountSchema'
mongoose.model('Account', accountSchema);
