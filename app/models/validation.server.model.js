// Invoke 'strict' JavaScript mode
'use strict';

// Load the module dependencies
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

// Define a new 'validationSchema'
var validationSchema = new Schema({  
  name: String,
  createdOn: {type: Date},
  createdBy: { type: Schema.ObjectId, ref: 'User' },
  createdWithin: {type: Schema.ObjectId, ref: 'Account' }
}, { collection : 'validations' });

// Create the 'Validation' model out of the 'validationSchema'
mongoose.model('Validation', validationSchema);
