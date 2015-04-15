// Invoke 'strict' JavaScript mode
'use strict';

// Create the 'brands' service
angular.module('brands').factory('Brands', ['$resource', function($resource) {
	// Use the '$resource' service to return an brand '$resource' object
    return $resource('api/brands/:brandId', {
        brandId: '@_id'
    }, {
        update: {
            method: 'PUT'
        }
    }
    );
}]);