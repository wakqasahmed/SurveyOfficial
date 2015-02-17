// Invoke 'strict' JavaScript mode
'use strict';

// Create the 'locations' service
angular.module('locations').factory('Locations', ['$resource', function($resource) {
	// Use the '$resource' service to return an location '$resource' object
    return $resource('api/locations/:locationId', {
        locationId: '@_id'
    }, {
        update: {
            method: 'PUT'
        }
    });
}]);
