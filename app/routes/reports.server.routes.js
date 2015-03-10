// Invoke 'strict' JavaScript mode
'use strict';

// Load the module dependencies
var users = require('../../app/controllers/users.server.controller'),
	reports= require('../../app/controllers/reports.server.controller');

// Define the routes module' method
module.exports = function(app) {
	// Set up the 'articles' base routes
	app.route('/api/reports')
	   .get(reports.list);


	app.route('/api/reports/monthly/participationRate')
		   .get(reports.generateMonthlyParticipationRate);

			app.route('/api/reports/monthly/testing')
				   .get(reports.testing);

		//	app.route('/api/reports/monthly/participationPercentage')
			//			.get(reports.generateMonthlyParticipationPercentage);

};
