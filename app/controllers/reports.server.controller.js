// Invoke 'strict' JavaScript mode
'use strict';

// Load the module dependencies

var mongoose = require('mongoose'),
	report = mongoose.model('Report'),
	Location = mongoose.model('Location'),
	testing = mongoose.model('Location'),
	Response = mongoose.model('Response'),
	ReportMonthlyParticipationRate = mongoose.model('ReportMonthlyParticipationRate');
	//Name = mongoose.model('ReportMonthlyParticipationRate');
	//ReportMonthlyParticipationPercentage = mongoose.model('ReportMonthlyParticipationPercentage');

// Create a new error handling controller method
var getErrorMessage = function(err) {
	if (err.errors) {
		for (var errName in err.errors) {
			if (err.errors[errName].message) return err.errors[errName].message;
		}
	} else {
		return 'Unknown server error';
	}
};

exports.generateMonthlyParticipationRate = function(req, res){

var o = {};
o.map = function () { emit(this.locationId, 1); }
o.reduce = function (locationId, count) { return Array.sum(count); }
o.out = { replace: 'report_participation_rate' }
o.verbose = true;
Response.mapReduce(o, function (err, model, stats) {
	console.log('map reduce took %d ms', stats.processtime);
/*
	model.find().exec(function(err, docs) {
		for(var d in docs)
		{
			//console.log('ObjectId(\'' + docs[d]._id + '\')');
var id = docs[d]._id;
			Location.where({"_id": id}).findOne(function(err, loc){
				if(err)
					console.log(getErrorMessage(err));
				else
					console.log(loc);
			});

		}
	});
*/

	// Send a JSON representation of the reports
	//res.json(model);

});


/*
	var mapper = function () {
		emit(this.x, 1);
	};

	var reducer = function(x, count){
	 	return Array.sum(count);
	};

	response.mapReduce(
		mapper,
		reducer,
		{
			out : "report_participation_rate"
		}
	 );
	*/

	ReportMonthlyParticipationRate.find().find().populate('_id').exec(function(err, docs){

	 	if(err) console.log(err);


		// Send a JSON representation of the reports
		res.json(docs);

	 });

};

/*exports.generateMonthlyParticipationPercentage = function(req, res){

var o = {};
o.map = function () { emit(this.locationId, 1); }
o.reduce = function (locationId, count) { return Array.sum(count); }
o.out = { replace: 'report_participation_rate' }
o.verbose = true;
Response.mapReduce(o, function (err, model, stats) {
	console.log('map reduce took %d ms', stats.processtime);
/*
	model.find().exec(function(err, docs) {
		for(var d in docs)
		{
			//console.log('ObjectId(\'' + docs[d]._id + '\')');
var id = docs[d]._id;
			Location.where({"_id": id}).findOne(function(err, loc){
				if(err)
					console.log(getErrorMessage(err));
				else
					console.log(loc);
			});

		}
	});


	// Send a JSON representation of the reports
	//res.json(model);

});



	var mapper = function () {
		emit(this.x, 1);
	};

	var reducer = function(x, count){
	 	return Array.sum(count);
	};

	response.mapReduce(
		mapper,
		reducer,
		{
			out : "report_participation_rate"
		}
	 );


	// populates a single object
	ReportMonthlyParticipationPercentage.find().populate('_id', 'name').exec(function(err, docs) {

	 	if(err) console.log(err);

		// Send a JSON representation of the reports
		res.json(docs);

	 });




};*/


// Create a new controller method that retrieves a list of reports
exports.list = function(req, res) {
	// Use the model 'find' method to get a list of reports
	report.find().exec(function(err, reports) {
		if (err) {
			// If an error occurs send the error message
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {


var rep =reports;
var count = 0;
						for(var r in rep){
							//console.log("count: " + count++ + rep[r]._id);
							//console.log(location.locationByID(rep[r]._id));

		var query = Location.where({"_id": rep[r]._id});
		console.log(rep[r]._id);
query.findOne(function(err, loc){
	if(err)
		console.log(getErrorMessage(err));
	else
		console.log(loc);
});

			}
			// Send a JSON representation of the reports
			res.json(reports);
		}
	});
};

exports.testing = function(req, res) {
	// Create a new brand object
	var loc = new Location(req.body);

	// Set the brand's 'createdBy' property
	loc.createdBy = req.user;

	// Set the brand's 'createdOn' property
	loc.createdOn = Date.now();

	console.log(loc);

	// Try saving the brand
	/*brand.save(function(err) {
		if (err) {
			console.log('error found');
			// If an error occurs send the error message
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			// Send a JSON representation of the brand
			res.json(brand);
		}
	});*/
};
