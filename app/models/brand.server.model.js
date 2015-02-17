// Invoke 'strict' JavaScript mode
'use strict';

// Load the module dependencies
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var path = require('path');
var filePluginLib = require('mongoose-file');
var filePlugin = filePluginLib.filePlugin;
var make_upload_to_model = filePluginLib.make_upload_to_model;
var uploads_base = path.join(__dirname, "uploads");
var uploads = path.join(uploads_base, "u");

// Define a new 'brandSchema'
var brandSchema = new Schema({
  name: String,
//  bgImage: file,
  createdOn: {type: Date},
  modifiedOn: {type: Date, default: Date.now},
  createdBy: { type: Schema.ObjectId, ref: 'User' }
}, { collection : 'brands' });

brandSchema.plugin(filePlugin, {
    name: "bgImage",
    upload_to: make_upload_to_model(uploads, 'photos'),
    relative_to: uploads_base
});

// Create the 'Brand' model out of the 'brandSchema'
mongoose.model('Brand', brandSchema);
