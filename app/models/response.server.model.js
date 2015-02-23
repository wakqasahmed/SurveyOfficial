// Invoke 'strict' JavaScript mode
'use strict';

// Load the module dependencies
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var languages = 'en ar'.split(' ');

var answerSchema = new Schema({
	questionId: String,
	timeTaken: String,
	value: String
});

var answersSchema = new Schema({
	prompt: [answerSchema],
	data: [answerSchema]
});

// Define a new 'responseSchema'
var responseSchema = new Schema({
 surveyId: {type: Schema.ObjectId, ref: 'Survey'},
 locationId: {type: Schema.ObjectId, ref: 'Location'},
 language: {type: String, enum: languages, default: 'en'},
 totalTimeTaken: String, //response total time
 status: {type: String, default: "incomplete"}, //complete, incomplete
 sourceOS: String, //android v4.4.2
 responses: [answersSchema],
 createdOn: {type: Date, default: Date.now}
}, { collection : 'responses' });

// Create the 'Response' model out of the 'ResponseSchema'
mongoose.model('Response', responseSchema);
