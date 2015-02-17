// Invoke 'strict' JavaScript mode
'use strict';

// Create the 'validations' controller
angular.module('validations').controller('ValidationsController', ['$scope', '$routeParams', '$location', 'Authentication', 'Validations', 'Dialogs',
    function($scope, $routeParams, $location, Authentication, Validations, Dialogs) {
    	// Expose the Authentication service
        $scope.authentication = Authentication;

      //Expose the Dialog service
        $scope.dialog = {
          message: ""
        }

        $scope.showDialog = function(title, message) {
          Dialogs.showDialog(title, message).then(
            function() {
              //alert('Yes clicked');
              $scope.delete();
              $location.path('/#!/validations/');
            },
            function() {
              //alert('No clicked');
            });
        }

        // Create a new controller method for creating new validations
        $scope.create = function() {
        	// Use the form fields to create a new validation $resource object
          var validation = new Validations({
              name: this.name,
              bgImage: 'asdfasdf'//this.bgImage,
          });

            // Use the validation '$save' method to send an appropriate POST request
            validation.$save(function(response) {
            	// If an validation was created successfully, redirect the user to the validation's page
                $location.path('validations/' + response._id);
            }, function(errorResponse) {
            	// Otherwise, present the user with the error message
                $scope.error = errorResponse.data.message;
            });
        };

        $scope.findList = function(data) {
          // Use the validation 'query' method to send an appropriate GET request
            $scope.validationsList = Validations.query();
        }

        // Create a new controller method for retrieving a list of validations
        $scope.find = function(data) {
        	// Use the validation 'query' method to send an appropriate GET request
          //  $scope.validations = Validations.query();

          $scope.validations = {
              dataSource: {
                  type: "json",
                  transport: {
                      read: "/api/locations/"
                  },
                  pageSize: 5,
                  filter: { field: "validations.name", operator: "eq", value: data },
                  serverPaging: true,
                  serverSorting: true
              },
              sortable: true,
              pageable: true,
              columns: [{
                  field: "_id",
                  title: "Validation Table ID",
                  width: "120px"},
                  {
                  //field: "name",
                  title: "Validation Table Name",
                  width: "120px",
                  template: "<a href='\\#\\!/validations/{{dataItem.validations._id}}'>{{dataItem.validations.name}}</a>"
                  }]
          };

        };

        // Create a new controller method for retrieving a single validation
        $scope.findOne = function() {
        	// Use the validation 'get' method to send an appropriate GET request
            $scope.validation = Validations.get({
                validationId: $routeParams.validationId
            });

            $scope.validation.account = [{ "sales_order_no": "0", "name": "Foodmark", "country":"United Arab Emirates" }];

            console.log($scope.validation.account[0].country);
        };

        // Create a new controller method for updating a single validation
        $scope.update = function() {
        	// Use the validation '$update' method to send an appropriate PUT request
            $scope.validation.$update(function() {
            	// If an validation was updated successfully, redirect the user to the validation's page
                $location.path('validations/' + $scope.validation._id);
            }, function(errorResponse) {
            	// Otherwise, present the user with the error message
                $scope.error = errorResponse.data.message;
            });
        };

        // Create a new controller method for deleting a single validation
        $scope.delete = function(validation) {
        	// If an validation was sent to the method, delete it
            if (validation) {
            	// Use the validation '$remove' method to delete the validation
                validation.$remove(function() {
                	// Remove the validation from the validations list
                    for (var i in $scope.validations) {
                        if ($scope.validations[i] === validation) {
                            $scope.validations.splice(i, 1);
                        }
                    }
                });
            } else {
            	// Otherwise, use the validation '$remove' method to delete the validation
                $scope.validation.$remove(function() {
                    $location.path('validations');
                });
            }
        };
    }
]);
