// Invoke 'strict' JavaScript mode
'use strict';

// Configure the 'locations' module routes
angular.module('locations').config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.
		when('/locations', {
			templateUrl: 'locations/views/list-locations.client.view.html'
		}).
		when('/locations/structure', {
			templateUrl: 'locations/views/treelist-locations.client.view.html'
		}).
		when('/locations/create', {
			templateUrl: 'locations/views/create-location.client.view.html'
		}).
		when('/locations/:locationId', {
			templateUrl: 'locations/views/view-location.client.view.html'
		}).
		when('/locations/:locationId/edit', {
			templateUrl: 'locations/views/edit-location.client.view.html'
		}).
		when('/locations/:locationId/create', {
			templateUrl: 'locations/views/create-validation.client.view.html'
		}).
		when('/locations/:locationId/validations/:validationId', {
			templateUrl: 'locations/views/view-validation.client.view.html'
		}).
		when('/locations/:locationId/:validationId/edit', {
			templateUrl: 'locations/views/edit-validation.client.view.html'
		}).
		when('/locations/:locationId/validations', {
			templateUrl: "locations/views/list-validation.client.view.html"
		});
	}
]);
