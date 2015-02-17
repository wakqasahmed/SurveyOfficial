// Invoke 'strict' JavaScript mode
'use strict';

// Create the 'validations' service
angular.module('validations').factory('Validations', ['$resource', function($resource) {
	// Use the '$resource' service to return an validation '$resource' object
    return $resource('api/validations/:validationId', {
        validationId: '@_id'
    }, {
        update: {
            method: 'PUT'
        }
    });
}]);
