// Invoke 'strict' JavaScript mode
'use strict';

// Load the module dependencies
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	autoIncrement = require('mongoose-auto-increment'),
	moment = require('moment-timezone');

var choiceSchema = new Schema({
	textEN: String,
	textAR: String,
  value: String,
  goto: {type: Number, default: null},
	notify: {type: Boolean, default: false}
});

var promptSchema = new Schema({
	title: String,
	type: {type: String, default: 'dropdown'},
	order: Number,
	required: {type: Boolean, default: true},
	disabled: {type: Boolean},
	validation: {}
});

var questionSchema = new Schema({
  titleEN: String,
	titleAR: String,
  type: String,
  order: Number,
  required: {type: Boolean, required: true},
  disabled: {type: Boolean},
  choices: [choiceSchema]
});

var questionsSchema = new Schema({
  prompt: [promptSchema],
  survey: [questionSchema]
});

// Define a new 'surveySchema'
var surveySchema = new Schema({
  name: {type: String},
  startDate: {type: Date, "default": Date.now},
  endDate: {type: Date},
  status: {type: String},
  locationIds: [String], //locations where this survey is used ex. carluccios locationId: 01
  type: {type: String},
	questions: [questionsSchema],
	createdOn: {type: Date},
	modifiedOn: {type: Date, default: moment.tz(Date.now(), 'Asia/Dubai')},
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
