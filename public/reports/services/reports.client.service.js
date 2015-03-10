// Invoke 'strict' JavaScript mode
'use strict';

// Create the 'reports' service
angular.module('reports').factory('reports', ['$resource', function($resource) {
	// Use the '$resource' service to return an article '$resource' object
    return $resource('api/reports/:articleId', {
        articleId: '@_id'
    }, {
        update: {
            method: 'PUT'
        }
    });
}]);