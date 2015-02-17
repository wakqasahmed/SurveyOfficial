// Invoke 'strict' JavaScript mode
'use strict';

// Configure the 'accounts' module routes
angular.module('accounts').config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.
		when('/accounts', {
			templateUrl: 'accounts/views/list-accounts.client.view.html'
		}).
		when('/accounts/structure', {
			templateUrl: 'accounts/views/treelist-accounts.client.view.html'
		}).
		when('/accounts/:accountId', {
			templateUrl: 'accounts/views/view-account.client.view.html'
		});
	}
]);
