// Invoke 'strict' JavaScript mode
'use strict';

// Create the 'brands' controller
angular.module('brands').controller('BrandsController', ['$scope', '$routeParams', '$location', 'Authentication', 'Brands',
    function($scope, $routeParams, $location, Authentication, Brands) {
    	// Expose the Authentication service
        $scope.authentication = Authentication;

        // Create a new controller method for creating new brands
        $scope.create = function() {
        	// Use the form fields to create a new brand $resource object
            var brand = new Brands({
                name: this.name,
                bgImage: 'asdfasdf'//this.bgImage,
            });

            // Use the brand '$save' method to send an appropriate POST request
            brand.$save(function(response) {
            	// If an brand was created successfully, redirect the user to the brand's page
                $location.path('brands/' + response._id);
            }, function(errorResponse) {
              console.log('angular save error');
            	// Otherwise, present the user with the error message
                $scope.error = errorResponse.data.message;
            });
        };

        // Create a new controller method for retrieving a list of brands
        $scope.find = function() {
        	// Use the brand 'query' method to send an appropriate GET request
          //  $scope.brands = Brands.query();

            $scope.brands = {
                dataSource: {
                    type: "json",
                    transport: {
                        read: "/api/brands"
                    },
                    pageSize: 5,
                    serverPaging: true,
                    serverSorting: true
                },
                sortable: true,
                pageable: true,
                columns: [{
                    //field: "name",
                    title: "Brand Name",
                    width: "120px",
                    template: "<a href='\\#\\!/brands/{{dataItem._id}}'>{{dataItem.name}}</a>"
                    },{
                    //field: "country",
                    title: "Brand Image",
                    width: "120px",
                    template: ""//"<img src='{{dataItem.bgImage}}'>"
                    }]
            };
        };

        // Create a new controller method for retrieving a single brand
        $scope.findOne = function() {
        	// Use the brand 'get' method to send an appropriate GET request

            $scope.brand = Brands.get({
                brandId: $routeParams.brandId
            });
/*
            $scope.brand = $http({method: 'GET', url: 'https://official-apisurveymark.rhcloud.com/api/brands/' }).
                  success(function(data, status, headers, config) {
                      e.success(data)
                  }).
                  error(function(data, status, headers, config) {
                      alert('something went wrong')
                      console.log(status);
                  });
*/

        };

        // Create a new controller method for updating a single brand
        $scope.update = function() {
        	// Use the brand '$update' method to send an appropriate PUT request
            $scope.brand.$update(function() {
            	// If an brand was updated successfully, redirect the user to the brand's page
                $location.path('brands/' + $scope.brand._id);
            }, function(errorResponse) {
            	// Otherwise, present the user with the error message
                $scope.error = errorResponse.data.message;
            });
        };

        // Create a new controller method for deleting a single brand
        $scope.delete = function(brand) {
        	// If an brand was sent to the method, delete it
            if (brand) {
            	// Use the brand '$remove' method to delete the brand
                brand.$remove(function() {
                	// Remove the brand from the brands list
                    for (var i in $scope.brands) {
                        if ($scope.brands[i] === brand) {
                            $scope.brands.splice(i, 1);
                        }
                    }
                });
            } else {
            	// Otherwise, use the brand '$remove' method to delete the brand
                $scope.brand.$remove(function() {
                    $location.path('brands');
                });
            }
        };
    }
]);
