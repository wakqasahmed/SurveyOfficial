// Invoke 'strict' JavaScript mode
'use strict';

// Load the module dependencies
var mongoose = require('mongoose'),
		User = mongoose.model('User'),
		Account = mongoose.model('Account'),
		passport = require('passport');


// Create a new error handling controller method
var getErrorMessage = function(err) {
	// Define the error message variable
	var message = '';

	// If an internal MongoDB error occurs get the error message
	if (err.code) {
		switch (err.code) {
			// If a unique index error occurs set the message error
			case 11000:
			case 11001:
				message = 'Username already exists';
				break;
			// If a general error occurs set the message error
			default:
				message = 'Something went wrong';
		}
	} else {
		// Grab the first error message from a list of possible errors
		for (var errName in err.errors) {
			if (err.errors[errName].message) message = err.errors[errName].message;
		}
	}

	// Return the message error
	return message;
};

exports.byAccount = function(req, res){

	var accountId = mongoose.Types.ObjectId(req.params.accountId);

	var totalRecords;
	User.count({}, function(err, count){
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

	// Use the model 'find' method to get a list of users by account
	User.find({'account._id': accountId}).limit(size).skip(skip).exec(function(err, users) {
		if (err) {
			// If an error occurs send the error message
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			// Send a JSON representation of the brand
			res.json({users: users, totalRecords: totalRecords});
		}
	});

}

// Create a new controller method that renders the signin page
exports.renderSignin = function(req, res, next) {
	// If user is not connected render the signin page, otherwise redirect the user back to the main application page
	if (!req.user) {
		// Use the 'response' object to render the signin page
		res.render('signin', {
			// Set the page title variable
			title: 'Sign-in Form',

			// Set the flash message variable
			messages: req.flash('error') || req.flash('info')
		});
	} else {
		return res.redirect('/');
	}
};

// Create a new controller method that renders the signup page
exports.renderSignup = function(req, res, next) {

	// If user is not connected render the signup page, otherwise redirect the user back to the main application page
	if (!req.user) {

			// Try finding a user document that was registered using the current OAuth provider
			Account.find({
				status: 'active'
			}, function(err, accounts) {

			// If an error occurs continue to the next middleware
			if (err) {
				return next(err);
			} else {
				// If an account could not be found, create a new account, otherwise, continue to the next middleware
				if(accounts.length < 1) {
					var profile = {};
					profile.name = "Trix";

					// Create the account
					var account = new Account(profile);

					// Try saving the new user document
					account.save(function(err) {
							res.render('signup', {
							// Set the page title variable
							title: 'Sign-up Form',
							accounts: account,
							// Set the flash message variable
							messages: req.flash('error')
						});
					});
				}
				else {
					// Use the 'response' object to render the signup page
						res.render('signup', {
						// Set the page title variable
						title: 'Sign-up Form',
						accounts: accounts,
						// Set the flash message variable
						messages: req.flash('error')
					});
				}

			}});
	} else {
		return res.redirect('/');
	}
};


// Create a new controller method that creates new 'regular' users
exports.signup = function(req, res, next) {
	// If user is not connected, create and login a new user, otherwise redirect the user back to the main application page
	if (!req.user) {
		// Create a new 'User' model instance
		var user = new User(req.body);
		var message = null;

		// Set the user provider property
		user.provider = 'local';

		// Retrieve account information using DBRef ObjectID
		Account.findOne({
			"_id": req.body.account
		}, function(err, account) {

		// If an error occurs continue to the next middleware
		if (err) {
			return next(err);
		} else {
			// If an account could not be found, send an error message, otherwise, continue to the next middleware
			if(account.length < 1) {
				return next({"message": "Account not found"});
			}
			else {

				user.account = account;
				console.log(account);
				console.log("User.Account: " + user.account);
				// Try saving the new user document
				user.save(function(err) {
					// If an error occurs, use flash messages to report the error
					if (err) {
						// Use the error handling method to get the error message
						var message = getErrorMessage(err);

						// Set the flash messages
						req.flash('error', message);

						// Redirect the user back to the signup page
						return res.redirect('/signup');
					}

					// If the user was created successfully use the Passport 'login' method to login
					req.login(user, function(err) {
						// If a login error occurs move to the next middleware
						if (err) return next(err);

						// Redirect the user back to the main application page
						return res.redirect('/');
					});
				});
			}
		}});

	} else {
		return res.redirect('/');
	}
};

// Create a new controller method that creates new 'OAuth' users
exports.saveOAuthUserProfile = function(req, profile, done) {
	// Try finding a user document that was registered using the current OAuth provider
	User.findOne({
		provider: profile.provider,
		providerId: profile.providerId
	}, function(err, user) {
		// If an error occurs continue to the next middleware
		if (err) {
			return done(err);
		} else {
			// If a user could not be found, create a new user, otherwise, continue to the next middleware
			if (!user) {
				// Set a possible base username
				var possibleUsername = profile.username || ((profile.email) ? profile.email.split('@')[0] : '');

				// Find a unique available username
				User.findUniqueUsername(possibleUsername, null, function(availableUsername) {
					// Set the available user name
					profile.username = availableUsername;

					// Create the user
					user = new User(profile);

					// Try saving the new user document
					user.save(function(err) {
						// Continue to the next middleware
						return done(err, user);
					});
				});
			} else {
				// Continue to the next middleware
				return done(err, user);
			}
		}
	});
};

// Create a new controller method for signing out
exports.signout = function(req, res) {
	// Use the Passport 'logout' method to logout
	req.logout();

	// Redirect the user back to the main application page
	res.redirect('/');
};

// Create a new controller middleware that is used to authorize authenticated operations
exports.requiresLogin = function(req, res, next) {
	// If a user is not authenticated send the appropriate error message
	if (!req.isAuthenticated()) {
		return res.status(401).send({
			message: 'User is not logged in'
		});
	}

	// Call the next middleware
	next();
};
