// Invoke 'strict' JavaScript mode
'use strict';

// Load the module dependencies
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	autoIncrement = require('mongoose-auto-increment');

var choiceSchema = new Schema({
  text: String,
  value: String,
  goto: {type: Number, "default": null},
	notify: {type: Boolean, default: false}
});

var promptSchema = new Schema({
	title: String,
	type: String,
	order: Number,
	required: {type: Boolean, required: true},
	disabled: {type: Boolean},
	choices: { type: Schema.ObjectId, ref: 'Validation' }
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
  prompt: [promptSchema],
  en: [questionSchema],
  ar: [questionSchema]
});

// Define a new 'surveySchema'
var surveySchema = new Schema({
  name: String,
  startDate: {type: Date, "default": Date.now},
  endDate: {type: Date},
  status: String,
  locationIds: Array, //locations where this survey is used ex. carluccios locationId: 01
  account: { type: Schema.ObjectId, ref: 'Account' }, //ex. foodmark accountId: 35
  type: String,
  questions: [questionsSchema],
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

// Create the 'Survey' model out of the 'SurveySchema'
mongoose.model('Survey', surveySchema);
