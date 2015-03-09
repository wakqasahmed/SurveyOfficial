// Invoke 'strict' JavaScript mode
'use strict';

// Load the module dependencies
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var keyValSchema = new Schema({
  text: String,
  value: String,
  status: String
});

// Define a new 'validationSchema'
var validationSchema = new Schema({  
  name: String,
  data: [keyValSchema],
  createdOn: {type: Date},
  modifiedOn: {type: Date, "default": Date.now},
  createdBy: { type: Schema.ObjectId, ref: 'User' }
}, { collection : 'validations' });

// Create the 'Validation' model out of the 'validationSchema'
mongoose.model('Validation', validationSchema);
