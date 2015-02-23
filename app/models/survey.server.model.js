// Invoke 'strict' JavaScript mode
'use strict';

// Load the module dependencies
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	autoIncrement = require('mongoose-auto-increment');

var choiceSchema = new Schema({
  text: String,
  value: String,
  goto: {type: Number, default: null},
	notify: {type: Boolean, default: false}
});

var promptSchema = new Schema({
	title: String,
	type: String,
	order: Number,
	required: {type: Boolean, required: true},
	disabled: {type: Boolean},
	choices: {}
});

var questionSchema = new Schema({
  title: String,
  type: String,
  order: Number,
  required: {type: Boolean, required: true},
  disabled: {type: Boolean},
  choices: [choiceSchema]
});

var questionsSchema = new Schema({
	name: {
	type: String,
	// Set a unique 'username' index
	unique: true,
},
  prompt: [promptSchema],
  en: [questionSchema],
  ar: [questionSchema]
});

// Create the 'Questions' model out of the 'questionsSchema'
mongoose.model('Questions', questionsSchema);

// Define a new 'surveySchema'
var surveySchema = new Schema({
  name: {type: String},
  startDate: {type: Date, "default": Date.now},
  endDate: {type: Date},
  status: {type: String},
  locationIds: {type: Array}, //locations where this survey is used ex. carluccios locationId: 01
  type: {type: String},
	questions: [questionsSchema],
//  questions: {type: mongoose.Schema.Types.ObjectId, ref: 'Questions'},
	createdOn: {type: Date},
	modifiedOn: {type: Date, "default": Date.now},
	createdBy: { type: Schema.ObjectId, ref: 'User' }
}, { collection : 'surveys' });

surveySchema.plugin(autoIncrement.plugin, {
    model: 'Survey',
    field: 'surveyNumber',
    startAt: 1,
    incrementBy: 1
});

// Create the 'Survey' model out of the 'surveySchema'
mongoose.model('Survey', surveySchema);
