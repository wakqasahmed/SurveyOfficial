// Invoke 'strict' JavaScript mode
'use strict';

// Load the module dependencies
var mongoose = require('mongoose'),
	Account = mongoose.model('Account');

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

// Create a new controller method that creates new accounts
exports.create = function(req, res) {
	// Create a new account object
	var account = new Account(req.body);

	// Set the account's 'creator' property
	account.creator = req.user;

	// Try saving the account
	account.save(function(err) {
		if (err) {
			// If an error occurs send the error message
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			// Send a JSON representation of the account
			res.json(account);
		}
	});
};

// Create a new controller method that retrieves a list of accounts
exports.list = function(req, res) {
	// Use the model 'find' method to get a list of accounts
	Account.find().sort('-created').populate('creator', 'firstName lastName fullName').exec(function(err, accounts) {
		if (err) {
			// If an error occurs send the error message
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			// Send a JSON representation of the account
			res.json(accounts);
		}
	});
};

// Create a new controller method that returns an existing account
exports.read = function(req, res) {
	res.json(req.account);
};

// Create a new controller method that updates an existing account
exports.update = function(req, res) {
	// Get the account from the 'request' object
	var account = req.account;

	// Update the account fields
	account.title = req.body.title;
	account.content = req.body.content;

	// Try saving the updated account
	account.save(function(err) {
		if (err) {
			// If an error occurs send the error message
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			// Send a JSON representation of the account
			res.json(account);
		}
	});
};

// Create a new controller method that delete an existing account
exports.delete = function(req, res) {
	// Get the account from the 'request' object
	var account = req.account;

	// Use the model 'remove' method to delete the account
	account.remove(function(err) {
		if (err) {
			// If an error occurs send the error message
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			// Send a JSON representation of the account
			res.json(account);
		}
	});
};

// Create a new controller middleware that retrieves a single existing account
exports.accountByID = function(req, res, next, id) {
	// Use the model 'findById' method to find a single account
	Account.findById(id).populate('creator', 'firstName lastName fullName').exec(function(err, account) {
		if (err) return next(err);
		if (!account) return next(new Error('Failed to load account ' + id));

		// If an account is found use the 'request' object to pass it to the next middleware
		req.account = account;

		// Call the next middleware
		next();
	});
};

// Create a new controller middleware that is used to authorize an account operation
exports.hasAuthorization = function(req, res, next) {
	// If the current user is not the creator of the account send the appropriate error message
	if (req.account.creator.id !== req.user.id) {
		return res.status(403).send({
			message: 'User is not authorized'
		});
	}

	// Call the next middleware
	next();
};
