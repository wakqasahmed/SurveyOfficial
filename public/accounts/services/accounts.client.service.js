// Invoke 'strict' JavaScript mode
'use strict';

// Create the 'accounts' service
angular.module('accounts').factory('Accounts', ['$resource', function($resource) {
	// Use the '$resource' service to return an account '$resource' object
    return $resource('api/accounts/:accountId', {
        accountId: '@_id'
    }, {
        update: {
            method: 'PUT'
        }
    });
}]);
