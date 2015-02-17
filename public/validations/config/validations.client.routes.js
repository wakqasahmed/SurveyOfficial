// Invoke 'strict' JavaScript mode
'use strict';

// Configure the 'validations' module routes
angular.module('validations').config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.
		when('/validations', {
			templateUrl: 'validations/views/list-validations.client.view.html'
		}).
		when('/validations/create', {
			templateUrl: 'validations/views/create-validation.client.view.html'
		}).
		when('/validations/:validationId', {
			templateUrl: 'validations/views/view-validation.client.view.html'
		}).
		when('/validations/:validationId/edit', {
			templateUrl: 'validations/views/edit-validation.client.view.html'
		});
	}
]);
