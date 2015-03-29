// Invoke 'strict' JavaScript mode
'use strict';

// Configure the 'responses' module routes
angular.module('responses').config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.
		when('/responses/dataexport', {
			templateUrl: 'responses/views/export-data.client.view.html'
		});
	}
]);
