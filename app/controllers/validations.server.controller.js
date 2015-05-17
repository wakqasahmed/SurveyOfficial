// Invoke 'strict' JavaScript mode
'use strict';

// Load the module dependencies
var mongoose = require('mongoose'),
	Validation = mongoose.model('Validation'),
	Location = mongoose.model('Location'),
    moment = require('moment-timezone');

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

// Create a new controller method that creates new validations
exports.create = function(req, res) {

	// Create a new validation object
	var validation = new Validation(req.body);

	// Set the validation's 'createdBy' property
	validation.createdBy = req.user;

	// Set the validation's 'createdOn' property
	validation.createdOn = moment.tz(Date.now(), 'Asia/Dubai');

	validation.createdWithin = req.user.account._id;

	console.log(validation);
	// Try saving the validation
	validation.save(function(err) {
		if (err) {
			// If an error occurs send the error message
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			// Send a JSON representation of the validation
			res.json(validation);
		}
	});
};

// Create a new controller method that retrieves a list of validations
exports.list = function(req, res) {

    var totalRecords;
    Validation.count({"createdWithin": req.user.account._id}, function(err, count){
        console.log(count);
        if (err) {
            // If an error occurs send the error message
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else {
            totalRecords = count;
        }
    });

    var page = parseInt(req.query.page),
        size = parseInt(req.query.pageSize),
        skip = parseInt(req.query.skip),
        take = parseInt(req.query.take);
//		skip = page > 0 ? ((page - 1) * size) : 0;

	// Use the model 'find' method to get a list of validations
	Validation.find({"createdWithin": req.user.account._id}).limit(size).skip(skip).exec(function(err, validations) {
		if (err) {
			// If an error occurs send the error message
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			// Send a JSON representation of the validation
            res.json({validations: validations, totalRecords: totalRecords});
			//res.json(validations);
		}
	});
};

// Create a new controller method that returns an existing validation
exports.read = function(req, res) {
	res.json(req.validation);
};

// Create a new controller method that updates an existing validation
exports.update = function(req, res) {
	// Get the validation from the 'request' object
	var validation = req.validation;

	// Update the validation fields
	validation.title = req.body.title;
	validation.content = req.body.content;

	// Try saving the updated validation
	validation.save(function(err) {
		if (err) {
			// If an error occurs send the error message
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			// Send a JSON representation of the validation
			res.json(validation);
		}
	});
};

exports.bulkLocationsUpdate = function(req, res) {

	var newValidationTable = req.params.tableName;

	var query = {};
	var update = {$addToSet: {'validations': {'name': newValidationTable, '_id': mongoose.Types.ObjectId()}}};

	var bulk = Location.collection.initializeOrderedBulkOp();
	bulk.find(query).update(update);
	bulk.execute(function(err, loc){
		if (err) {
			// If an error occurs send the error message
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			// Send a JSON representation of the location
			res.send({"status":"success"});
		}
		//console.log(loc);
	});

	/*
	Location.findAndUpdate({}).exec(function(err, loc){
		if (err) {
			// If an error occurs send the error message
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			console.log(loc);
			for(var i = 0; i < loc.length; i++)
			{
					var currLoc =	JSON.parse(loc.validations[0]);
					console.log(currLoc);
					//loc.validations[0].push(newValidationTable);
			}

			// Send a JSON representation of the location
			res.send({"status":"success"});
		}
	});*/
}

// Create a new controller method that delete an existing validation
exports.delete = function(req, res) {
	// Get the validation from the 'request' object
	var validation = req.validation;

	// Use the model 'remove' method to delete the validation
	validation.remove(function(err) {
		if (err) {
			// If an error occurs send the error message
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			// Send a JSON representation of the validation
			res.json(validation);
		}
	});
};

// Create a new controller middleware that retrieves a single existing validation
exports.validationByID = function(req, res, next, id) {
	// Use the model 'findById' method to find a single validation
	Validation.findById(id).exec(function(err, validation) {
		if (err) return next(err);
		if (!validation) return next(new Error('Failed to load validation ' + id));

		// If an validation is found use the 'request' object to pass it to the next middleware
		req.validation = validation;

		// Call the next middleware
		next();
	});
};

// Create a new controller middleware that is used to authorize an validation operation
exports.hasAuthorization = function(req, res, next) {
	// If the current user is not the creator of the validation or current user is not 'admin' role send the appropriate error message
	if (req.user.role !== 'admin') { //|| req.validation.createdBy.id !== req.user.id) {
		return res.status(403).send({
			message: 'User is not authorized'
		});
	}

	// Call the next middleware
	next();
};
