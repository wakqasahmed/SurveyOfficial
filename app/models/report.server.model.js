// Invoke 'strict' JavaScript mode
'use strict';

// Load the module dependencies
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

// Define a new 'ArticleSchema'
var ReportSchema = new Schema({
},
{collection: 'users_comments'});

var ReportMonthlyParticipationRateSchema = new Schema({
	_id: {type: Schema.Types.ObjectId, ref: 'Location'},
	count: Number
},
{collection: "report_participation_rate"});



// Create the 'Article' model out of the 'ArticleSchema'
mongoose.model('Report', ReportSchema);
mongoose.model('ReportMonthlyParticipationRate', ReportMonthlyParticipationRateSchema);
//mongoose.model('ReportMonthlyParticipationPercentage', ReportMonthlyParticipationPercentageSchema);
