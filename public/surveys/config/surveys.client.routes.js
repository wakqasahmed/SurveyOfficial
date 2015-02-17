// Invoke 'strict' JavaScript mode
'use strict';

// Configure the 'surveys' module routes
angular.module('surveys').config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.
		when('/surveys', {
			templateUrl: 'surveys/views/list-surveys.client.view.html'
		}).
		when('/surveys/create', {
			templateUrl: 'surveys/views/create-survey.client.view.html'
		}).
		when('/surveys/:surveyId', {
			templateUrl: 'surveys/views/view-survey.client.view.html'
		}).
		when('/surveys/:surveyId/edit', {
			templateUrl: 'surveys/views/edit-survey.client.view.html'
		});
	}
]);
