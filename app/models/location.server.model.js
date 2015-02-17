// Invoke 'strict' JavaScript mode
'use strict';

// Load the module dependencies
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var statuses = 'active inactive'.split(' ');

var contactPersonSchema = new Schema({
  name: String,
  email: String,
  phoneOffice: Number,
  phoneCell: Number
});

var keyValSchema = new Schema({
	name: String,
	value: String,
	status: String
});

// Define a new 'validationSchema'
var validationSchema = new Schema({
	name: String/*,
	data: [keyValSchema],
	createdOn: {type: Date}*/,
	modifiedOn: {type: Date, "default": Date.now}
});

// Define a new 'locationSchema'
var locationSchema = new Schema({
  name: { type: String },
	status: { type: String, enum: statuses, "default": 'active' },
/*
  country: String,
  state: String,
  postalCode: String,
  timezone: String,
  phoneManager: Number,
  // Always store coordinates longitude, latitude order.
  coords: {type: [Number], index: '2dsphere', required: true},
  contactPerson: [contactPersonSchema],
  brand: { type: Schema.ObjectId, ref: 'Brand' },*/
	validations: [validationSchema],
	/*
  createdOn: {type: Date},*/
  modifiedOn: {type: Date, default: Date.now}
/*
	createdBy: { type: Schema.ObjectId, ref: 'User' }*/
}, { collection : 'locations' });

// Create the 'Location' model out of the 'LocationSchema'
mongoose.model('Location', locationSchema);
