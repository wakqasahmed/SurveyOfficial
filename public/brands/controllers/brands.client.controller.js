// Invoke 'strict' JavaScript mode
'use strict';

// Create the 'brands' controller
angular.module('brands').controller('BrandsController', ['$scope', '$routeParams', '$location', '$upload', '$http', '$sce', 'Authentication', 'Brands', 'Dialogs', 'Locations',
    function($scope, $routeParams, $location, $upload, $http, $sce, Authentication, Brands, Dialogs, Locations) {
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
              $scope.delete($scope.brand);
              //$location.path('/#!/brands/');
            },
            function() {
              //alert('No clicked');
            });
        }
/*
        $scope.$watch('files', function () {
          console.log($scope.files);
            $scope.upload($scope.files);
        });
*/


        $scope.onFileSelect = function(image) {
          if (angular.isArray(image)) {
              image = image[0];
          }

          // This is how I handle file types in client side
          if (image.type !== 'image/png' && image.type !== 'image/jpeg') {
              alert('Only PNG and JPEG are accepted.');
              return;
          }

          $scope.uploadInProgress = true;
          $scope.uploadProgress = 0;

          $scope.upload = function (image) {
              $upload.upload({
                  url: '/api/brands/upload',
                  method: 'POST',
                  file: image
              }).progress(function(event) {
                  $scope.uploadProgress = Math.floor(event.loaded / event.total);
                  $scope.$apply();
              }).success(function(data, status, headers, config) {
                  $scope.uploadInProgress = false;
                  console.log('file ' + config.file.name + 'uploaded. Response: ' + data);
                  // If you need uploaded file immediately
                  //$scope.uploadedImage = JSON.parse(data);
                  $scope.uploadedImageName = data;
              }).error(function(err) {
                  $scope.uploadInProgress = false;
                  console.log('Error uploading file: ' + err.message || err);
              });
          };

          $scope.upload(image);

        };

        // Create a new controller method for creating new brands
        $scope.create = function() {

          	// Use the form fields to create a new brand $resource object
            var brand = new Brands({
                name: this.name,
                status: this.status ? 'active' : 'inactive',
                bgImage: this.uploadedImageName,
                country: this.country,
                state: this.state,
                phoneManager: this.phoneManager,
                contactPerson: [{
                  name: this.contactPerson_name,
                  email: this.contactPerson_email,
                  phoneOffice: this.contactPerson_phoneOffice,
                  phoneCell: this.contactPerson_phoneCell
                }],
                color: this.color,
                createdOn: moment.tz(Date.now(), 'Asia/Dubai'),
                createdBy: $scope.authentication.user._id
            });

            console.log(brand.createdOn);
            // Use the brand '$save' method to send an appropriate POST request
            brand.$save(function(response) {
              console.log("create brand called and success");
            	// If an brand was created successfully, redirect the user to the brand's page
                $location.path('brands/' + response._id);
            }, function(errorResponse) {
            	// Otherwise, present the user with the error message
                $scope.error = errorResponse.data.message;
            });
        };

        // Create a new controller method for retrieving a list of brands
        $scope.find = function() {
        	// Use the brand 'query' method to send an appropriate GET request
            //$scope.brandsCount = Brands.query();

          var bgImagePath = "/content/brand_images/";

          $scope.brands = {
              dataSource: {
                  type: "json",
                  transport: {
                      read: "/api/brands"
                  },
                  pageSize: 2,
                  serverPaging: true,
                  serverSorting: true,
                  schema: {
                      data: function (data) { return data.brands; },
                      total: function (data) {
                          $scope.brandsCount = data.totalRecords;
                          return data.totalRecords; }
                  }
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
                  title: "Background Image",
                  width: "120px",
                  template: "<img src='/content/brand_images/{{dataItem.bgImage}}' width='150px' height='250px' />"
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
            $scope.brand.account = [{ "sales_order_no": "0", "name": $scope.authentication.user.account.name, "country":"United Arab Emirates" }];

            console.log($scope.brand.account[0].country);
            console.log($scope.authentication.user.account.name);
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

            $http({method: 'GET', url: '/api/locations/locationsByBrands/' + brand._id}).
                success(function(data, status, headers, config) {
                    // this callback will be called asynchronously
                    // when the response is available
                    $scope.associatedLocations = data;

                    console.log(data);

                    if($scope.associatedLocations.length) {
                        // Otherwise, present the user with the error message
                        $scope.error = "Brand cannot be deleted, because it is already linked with the following locations:<br><div ng-repeat='loc in associatedLocations'>{{loc.name}}</div>";
                    }
                    // If a brand was sent to the method, delete it
                    else if(brand) {
                         // Use the brand '$remove' method to delete the brand
                         brand.$remove(function() {
                             // Remove the brand from the brands list
                             for (var i in $scope.brands) {
                                if ($scope.brands[i] === brand) {
                                    $scope.brands.splice(i, 1);
                                }
                             }

                             $location.path('brands/');
                         });
                    } else {
                        // Otherwise, use the brand '$remove' method to delete the brand
                        $scope.brand.$remove(function() {
                            $location.path('brands/');
                        });
                    }


                }).
                error(function(data, status, headers, config) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.

                    // Otherwise, present the user with the error message
                    $scope.error = errorResponse.data.message;
                });

        };
    }
]);
