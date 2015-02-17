// Invoke 'strict' JavaScript mode
'use strict';

// Load the module dependencies
var mongoose = require('mongoose'),
	Brand = mongoose.model('Brand');

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

// Create a new controller method that creates new brands
exports.create = function(req, res) {
	// Create a new brand object
	var brand = new Brand(req.body);

	// Set the brand's 'createdBy' property
	brand.createdBy = req.user;

	// Set the brand's 'createdOn' property
	brand.createdOn = Date.now;

	console.log('create called');

	// Try saving the brand
	brand.save(function(err) {
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
	});
};

// Create a new controller method that retrieves a list of brands
exports.list = function(req, res) {
	// Use the model 'find' method to get a list of brands
	Brand.find().sort('-created').populate('creator', 'firstName lastName fullName').exec(function(err, brands) {
		if (err) {
			// If an error occurs send the error message
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			// Send a JSON representation of the brand
			res.json(brands);
		}
	});
};

// Create a new controller method that returns an existing brand
exports.read = function(req, res) {
	res.json(req.brand);
};

// Create a new controller method that updates an existing brand
exports.update = function(req, res) {
	// Get the brand from the 'request' object
	var brand = req.brand;

	// Update the brand fields
	brand.title = req.body.title;
	brand.content = req.body.content;

	// Try saving the updated brand
	brand.save(function(err) {
		if (err) {
			// If an error occurs send the error message
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			// Send a JSON representation of the brand
			res.json(brand);
		}
	});
};

// Create a new controller method that delete an existing brand
exports.delete = function(req, res) {
	// Get the brand from the 'request' object
	var brand = req.brand;

	// Use the model 'remove' method to delete the brand
	brand.remove(function(err) {
		if (err) {
			// If an error occurs send the error message
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			// Send a JSON representation of the brand
			res.json(brand);
		}
	});
};

// Create a new controller middleware that retrieves a single existing brand
exports.brandByID = function(req, res, next, id) {
	// Use the model 'findById' method to find a single brand
	Brand.findById(id).populate('creator', 'firstName lastName fullName').exec(function(err, brand) {
		if (err) return next(err);
		if (!brand) return next(new Error('Failed to load brand ' + id));

		// If an brand is found use the 'request' object to pass it to the next middleware
		req.brand = brand;

		// Call the next middleware
		next();
	});
};

// Create a new controller middleware that is used to authorize an brand operation
exports.hasAuthorization = function(req, res, next) {
	// If the current user is not the creator of the brand send the appropriate error message
	if (req.user.role !== 'admin') {
		return res.status(403).send({
			message: 'User is not authorized'
		});
	}

	// Call the next middleware
	next();
};
