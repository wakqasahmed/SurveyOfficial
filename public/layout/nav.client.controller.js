'use strict';

// Create the 'navigations' controller
angular.module('navigations').controller('NavController', ['$scope', '$routeParams', '$location',
    function($scope, $routeParams, $location) {
        $scope.$location = $location;

        $scope.urlListValidation = "#!/locations/" + $routeParams.locationId + "/validations";
/*
        $scope.setActive = function() {
          var type = $location.path().split('/')[0];

          $scope.accountsActive = '';
          $scope.brandsActive = '';
          $scope.locationsActive = '';
          $scope.surveysActive = '';

          $scope[type + 'Active'] = 'active';
        }

        $scope.setActive();
        */
      }
]);
