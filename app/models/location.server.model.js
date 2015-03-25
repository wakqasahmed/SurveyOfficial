// Invoke 'strict' JavaScript mode
'use strict';

// Load the module dependencies
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	moment = require('moment-timezone');

var statuses = 'active inactive'.split(' ');

var contactPersonSchema = new Schema({
  name: String,
  email: String,
  phoneOffice: String,
  phoneCell: String
});

var keyValSchema = new Schema({
	name: String,
	value: String,
	status: String
});

// Define a new 'validationSchema'
var validationSchema = new Schema({
	name: {type: String},
	data: [keyValSchema],
	createdOn: {type: Date},
	modifiedOn: {type: Date}
});

// Define a new 'locationSchema'
var locationSchema = new Schema({
  name: { type: String, unique: true },
	status: { type: String, enum: statuses, "default": 'active' },
  country: String,
  state: String,
  postalCode: String,
  timezone: String,
  phoneManager: String,
  // Always store coordinates longitude, latitude order.
  coords: {type: [Number], index: '2dsphere', required: true},
  contactPerson: [contactPersonSchema],
  brand: { type: Schema.ObjectId, ref: 'Brand' },
	validations: [validationSchema],
  createdOn: {type: Date},
  modifiedOn: {type: Date},
	createdBy: { type: Schema.ObjectId, ref: 'User' },
	createdWithin: {type: Schema.ObjectId, ref: 'Account' }
}, { collection : 'locations' });

// Create the 'Location' model out of the 'LocationSchema'
mongoose.model('Location', locationSchema);
