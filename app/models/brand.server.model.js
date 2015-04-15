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

// Define a new 'brandSchema'
var brandSchema = new Schema({
  name: {type: String, unique: true},
  status: { type: String, enum: statuses, "default": 'active' },
  bgImage: String,
  country: String,
  state: String,
  phoneManager: String,
  contactPerson: [contactPersonSchema],
  color: {type: String, default: '#000000'},
  createdOn: {type: Date},
  modifiedOn: {type: Date, default: moment.tz(Date.now(), 'Asia/Dubai')},
  createdBy: { type: Schema.ObjectId, ref: 'User' }
}, { collection : 'brands' });

// Create the 'Brand' model out of the 'brandSchema'
mongoose.model('Brand', brandSchema);
