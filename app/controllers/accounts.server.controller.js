// Invoke 'strict' JavaScript mode
'use strict';

// Load the module dependencies
var mongoose = require('mongoose'),
	Account = mongoose.model('Account'),
	Location = mongoose.model('Location'),
	Brand = mongoose.model('Brand'),
	ObjectId = mongoose.Types.ObjectId;

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

	// Set the account's 'createdBy' property
	// account.createdBy = req.user;

	account.createdOn = Date.now();

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
    var query = {};

    if(req.user.role !== "admin" || req.user.role !== "manager")
        query = {"_id": req.user.account._id};

	// Use the model 'find' method to get a list of accounts
	Account.find(query).sort('-createdOn').exec(function(err, accounts) {
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

exports.treeview = function(req, res) {
	console.log(req.params.accountId);
	var accountId = new ObjectId(req.params.accountId);

Location.aggregate([
        { "$match": { "createdWithin": accountId } },
        { "$group": {
            _id: "$brand",
						name: {$push: '$name'}
						//"name": { "$first": "$name" }
        }}
    ]).exec(function(err,results){
        if (err) {
					// If an error occurs send the error message
					return res.status(400).send({
						message: getErrorMessage(err)
					});
				} else {

        Brand.populate(results, { "path": "_id", "select": "name" }, function(err,results) {
            if (err) throw err;
            //console.log( JSON.stringify( results, undefined, 4 ) );

						results = results.map(function(doc) {
								doc.text = doc._id.name;
								doc.items = [];

								for (var i = 0; i < doc.name.length; i++) {
									var temp1 = {'text': doc.name[i]};
									doc.items.push(temp1);
								}

								delete doc._id;
								delete doc.name;
								return doc;
						});

						// Send a JSON representation of the locations
						res.json(results);
					});
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
//	if (req.account.createdBy.id !== req.user.id) {
	if (req.user.role !== "Admin" || req.user.role !== "Owner") {
		return res.status(403).send({
			message: 'User is not authorized'
		});
	}

	// Call the next middleware
	next();
};
