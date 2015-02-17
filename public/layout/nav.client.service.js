// Invoke 'strict' JavaScript mode
'use strict';

// Create the 'navigations' service
angular.module('navigations').factory('Navigations', ['$resource', function($resource) {
  // Use the '$resource' service to return an article '$resource' object

  var service = {
      setActive: setActive
  };

  return service;

  var setActive = function(type) {
    $scope.accountsActive = '';
    $scope.brandsActive = '';
    $scope.locationsActive = '';
    
    $scope[type + 'Active'] = 'active';
  }

}]);
