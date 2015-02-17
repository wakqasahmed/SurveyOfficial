// Invoke 'strict' JavaScript mode
'use strict';

// Configure the 'reports' module routes
angular.module('reports').config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.
		when('/reports', {
			templateUrl: 'reports/views/list-reports.client.view.html'
		}).
		when('/reports/staff', {
			templateUrl: 'reports/views/staff-report.client.view.html'
		}).
		when('/reports/monthly', {
			templateUrl: 'reports/views/monthly-report.client.view.html'
		});
	}
]);
