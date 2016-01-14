// Invoke 'strict' JavaScript mode
'use strict';

// Load the module dependencies
var config = require('./config'),
	express = require('express'),
	morgan = require('morgan'),
	compress = require('compression'),
	bodyParser = require('body-parser'),
	methodOverride = require('method-override'),
	session = require('express-session'),
	flash = require('connect-flash'),
	passport = require('passport'),
	path = require('path'),
	cors = require('cors');

// Define the Express configuration method
module.exports = function() {
	// Create a new Express application instance
	var app = express();

	// Use the 'NDOE_ENV' variable to activate the 'morgan' logger or 'compress' middleware
	if (process.env.NODE_ENV === 'development') {
		app.use(morgan('dev'));
		global.brandImagePath = "http://localhost:3000/content/brand_images/";
	} else if (process.env.NODE_ENV === 'production') {
		app.use(compress());
		global.brandImagePath = "http://backend-ifeed.rhcloud.com/content/brand_images/";
	}

    app.use(cors());
	// Use the 'body-parser' and 'method-override' middleware functions
	app.use(bodyParser.urlencoded({
		extended: true
	}));
	app.use(bodyParser.json({limit: '50mb'}));
	app.use(methodOverride());

	// Configure the 'session' middleware
	app.use(session({
		saveUninitialized: true,
		resave: true,
		secret: config.sessionSecret
	}));

	// Set the application view engine and 'views' folder
	app.set('views', './app/views');
	app.set('view engine', 'ejs');

	// Configure the flash messages middleware
	app.use(flash());

	// Configure the Passport middleware
	app.use(passport.initialize());
	app.use(passport.session());

	// Load the routing files
	require('../app/routes/index.server.routes.js')(app);
	require('../app/routes/users.server.routes.js')(app);
	require('../app/routes/accounts.server.routes.js')(app);
	require('../app/routes/locations.server.routes.js')(app);
	require('../app/routes/brands.server.routes.js')(app);
	require('../app/routes/validations.server.routes.js')(app);
	require('../app/routes/surveys.server.routes.js')(app);
	require('../app/routes/responses.server.routes.js')(app);
	require('../app/routes/reports.server.routes.js')(app);

	// Configure static file serving
	app.use(express.static('./public'));

	global.appRoot = path.resolve(__dirname);
//	console.log(appRoot);

	// Return the Express application instance
	return app;
};
