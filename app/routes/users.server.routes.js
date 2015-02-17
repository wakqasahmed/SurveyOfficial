// Invoke 'strict' JavaScript mode
'use strict';

// Load the module dependencies
var users = require('../../app/controllers/users.server.controller'),
	passport = require('passport');

// Define the routes module' method
module.exports = function(app) {

	var sendJSONresponse = function(res, status, content) {
	  res.status(status);
	  res.json(content);
	};

	// Set up the 'signup' routes
	app.route('/signup')
	   .get(users.renderSignup)
	   .post(users.signup);

	// Set up the 'signin' routes - Mobile App API Method
	app.route('/app/signin')
	  .post(passport.authenticate('local', function(req, res) {
			//res.redirect('/users/' + req.user.username);
	    if (!req.user) {
				//console.log(res);
				sendJSONresponse(res, 404, {"message": "locationid not found"});
			}
			else {
				//console.log(req.user);
				sendJSONresponse(res, 200, req.user);
			}
		}));

	// Set up the 'signin' routes - Admin Panel
	app.route('/signin')
	   .get(users.renderSignin)
	   .post(passport.authenticate('local', {
			successRedirect: '/',
			failureRedirect: '/signin',
			failureFlash: true
	   }));

	// Set up the Facebook OAuth routes
	app.get('/oauth/facebook', passport.authenticate('facebook', {
		failureRedirect: '/signin'
	}));
	app.get('/oauth/facebook/callback', passport.authenticate('facebook', {
		failureRedirect: '/signin',
		successRedirect: '/'
	}));

	// Set up the Twitter OAuth routes
	app.get('/oauth/twitter', passport.authenticate('twitter', {
		failureRedirect: '/signin'
	}));
	app.get('/oauth/twitter/callback', passport.authenticate('twitter', {
		failureRedirect: '/signin',
		successRedirect: '/'
	}));

	// Set up the Google OAuth routes
	app.get('/oauth/google', passport.authenticate('google', {
		scope: [
			'https://www.googleapis.com/auth/userinfo.profile',
			'https://www.googleapis.com/auth/userinfo.email'
		],
		failureRedirect: '/signin'
	}));
	app.get('/oauth/google/callback', passport.authenticate('google', {
		failureRedirect: '/signin',
		successRedirect: '/'
	}));

	// Set up the 'signout' route
	app.get('/signout', users.signout);
};
