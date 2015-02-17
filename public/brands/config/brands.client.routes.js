// Invoke 'strict' JavaScript mode
'use strict';

// Configure the 'brands' module routes
angular.module('brands').config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.
		when('/brands', {
			templateUrl: 'brands/views/list-brands.client.view.html'
		}).
		when('/brands/create', {
			templateUrl: 'brands/views/create-brand.client.view.html'
		}).
		when('/brands/:brandId', {
			templateUrl: 'brands/views/view-brand.client.view.html'
		}).
		when('/brands/:brandId/edit', {
			templateUrl: 'brands/views/edit-brand.client.view.html'
		});
	}
]); 
