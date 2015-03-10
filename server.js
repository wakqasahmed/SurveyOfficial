// Invoke 'strict' JavaScript mode
'use strict';

// Set the 'NODE_ENV' variable
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var ip_addr = process.env.OPENSHIFT_NODEJS_IP   || '127.0.0.1';
var port    = process.env.OPENSHIFT_NODEJS_PORT || '3000';

// Load the module dependencies
var mongoose = require('./config/mongoose'),
	express = require('./config/express'),
	passport = require('./config/passport');

// Create a new Mongoose connection instance
var db = mongoose();

// Create a new Express application instance
//var app = express();
var app = express({
		name : process.env.OPENSHIFT_APP_NAME || "Surveymark"
});

if(process.env.NODE_ENV == 'development'){
	app.locals.pretty = true;
	app.set('json spaces', 2);
}

// Configure the Passport middleware
var passport = passport();

// Use the Express application instance to listen to the '3000' port
//app.listen(3000);

app.listen(port ,ip_addr, function(){
    console.log('Server running at %s ', 'http://' + ip_addr + ':' + port);
});

// Log the server status to the console
//console.log('Server running at http://localhost:3000/');

// Use the module.exports property to expose our Express application instance for external usage
module.exports = app;
