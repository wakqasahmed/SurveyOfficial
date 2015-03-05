// Invoke 'strict' JavaScript mode
'use strict';

// Load the module dependencies
var mongoose = require('mongoose'),
	Response = mongoose.model('Response');

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

// Create a new controller method that creates new responses
exports.create = function(req, res) {

	// Create a new response object
	//var responses = req.body.responses;
	var responses = req.body;

	var err_responses = [];
	var success_responses = [];
	var error = false;

	for(var r in responses){

		var response = new Response(responses[r]);

		// Try saving the response
		response.save(function(err) {
			if (err) {
				error = true;
				err_responses.push(response);
				//console.log(err_responses);
			}
			else {
				success_responses.push(response);
				//console.log(success_response);
			}
		});

	}

	if(error){
			res.send({state: 'failure', err_responses: err_responses});
	}
	else {
		//console.log(success_responses);
		// Send a JSON representation of the response
		res.send({state: 'success', success_responses: success_responses});
	}

};

// Create a new controller method that retrieves a list of responses
exports.list = function(req, res) {
	// Use the model 'find' method to get a list of responses
	Response.find().sort('-created').populate('createdBy', 'firstName lastName fullName').exec(function(err, responses) {
		if (err) {
			// If an error occurs send the error message
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			// Send a JSON representation of the response
			res.json(responses);
		}
	});
};

// Create a new controller method that returns an existing response
exports.read = function(req, res) {
	res.json(req.response);
};

// Create a new controller method that updates an existing response
exports.update = function(req, res) {
	// Get the response from the 'request' object
	var response = req.response;

	// Update the response fields
	response.title = req.body.title;
	response.content = req.body.content;

	// Try saving the updated response
	response.save(function(err) {
		if (err) {
			// If an error occurs send the error message
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			// Send a JSON representation of the response
			res.json(response);
		}
	});
};

// Create a new controller method that delete an existing response
exports.delete = function(req, res) {
	// Get the response from the 'request' object
	var response = req.response;

	// Use the model 'remove' method to delete the response
	response.remove(function(err) {
		if (err) {
			// If an error occurs send the error message
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			// Send a JSON representation of the response
			res.json(response);
		}
	});
};

// Create a new controller middleware that retrieves a single existing response
exports.responseByID = function(req, res, next, id) {
	// Use the model 'findById' method to find a single response
	Response.findById(id).populate('createdBy', 'firstName lastName fullName').exec(function(err, response) {
		if (err) return next(err);
		if (!response) return next(new Error('Failed to load response ' + id));

		// If an response is found use the 'request' object to pass it to the next middleware
		req.response = response;

		// Call the next middleware
		next();
	});
};

// Create a new controller middleware that is used to authorize an response operation
exports.hasAuthorization = function(req, res, next) {
	// If the current user is not the creator of the response or current user is not 'admin' role send the appropriate error message
	if (req.user.role !== 'admin') { //|| req.response.createdBy.id !== req.user.id) {
		return res.status(403).send({
			message: 'User is not authorized'
		});
	}

	// Call the next middleware
	next();
};
