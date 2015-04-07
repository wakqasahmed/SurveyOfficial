// Invoke 'strict' JavaScript mode
'use strict';

// Create the 'locations' controller
angular.module('locations').controller('LocationsController', ['$scope', '$routeParams', '$location', '$http', 'Authentication', 'Locations', 'Dialogs',
    function($scope, $routeParams, $location, $http, Authentication, Locations, Dialogs) {
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
              $location.path('/#!/locations/');
            },
            function() {
              //alert('No clicked');
            });
        }

        // Create a new controller method for retrieving a list of brands with status 'active'
        $scope.findActiveBrands = function() {
          $http({method: 'GET', url: '/api/brands/active'}).
            success(function(data, status, headers, config) {
              // this callback will be called asynchronously
              // when the response is available
              $scope.activeBrands = data;
            }).
            error(function(data, status, headers, config) {
              // called asynchronously if an error occurs
              // or server returns response with an error status.
            });
        };

        // Populate timezones list
        $scope.populateTimezones = function() {
          $scope.timezones = moment.tz.names();
        };

        // Create a new controller method for creating new locations
        $scope.create = function() {

          $scope.coords = [this.coords_longitude, this.coords_latitude];

        	// Use the form fields to create a new location $resource object
            var location = new Locations({
                name: this.name,
                status: this.status ? 'active' : 'inactive',
                country: this.country,
                state: this.state,
                postalCode: this.postalCode,
                timezone: 'Asia/Dubai',
                phoneManager: this.phoneManager,
                brand: this.brand._id,
                coords: $scope.coords,
                contactPerson: [{
                  name: this.contactPerson_name,
                  email: this.contactPerson_email,
                  phoneOffice: this.contactPerson_phoneOffice,
                  phoneCell: this.contactPerson_phoneCell
                }]
            });

            // Use the location '$save' method to send an appropriate POST request
            location.$save(function(response) {
            	// If an location was created successfully, redirect the user to the location's page
                $location.path('locations/' + response._id);
            }, function(errorResponse) {
            	// Otherwise, present the user with the error message
                $scope.error = errorResponse.data.message;
            });
        };

        // Create a new controller method for retrieving a list of locations
        $scope.find = function() {
        	// Use the location 'query' method to send an appropriate GET request
          //  $scope.locations = Locations.query();

            $scope.locations = {
                dataSource: {
                    type: "json",
                    transport: {
                        read: "/api/locations"
                    }/*,
                    pageSize: 5,
                    serverPaging: true,
                    serverSorting: true*/
                },
                sortable: true,
                //pageable: true,
                columns: [{
                    //field: "name",
                    title: "Location Name",
                    width: "120px",
                    template: "<a href='\\#\\!/locations/{{dataItem._id}}'>{{dataItem.name}}</a>"
                    },{
                    //field: "country",
                    title: "Location Address",
                    width: "120px",
                    template: "{{'PO Box ' + dataItem.postalCode + ' ' + dataItem.state + ' ' + dataItem.country}}"
                    }]
            };
        };

        // Create a new controller method for retrieving a list of validations according to locations
        $scope.findValidations = function() {
          // Use the location 'query' method to send an appropriate GET request
          //  $scope.locations = Locations.query();

          $scope.currLocation = Locations.get({
              locationId: $routeParams.locationId
          });

          /*
          var locationId = $routeParams.locationId;
          var urlAPI = "/api/locations/" + locationId;
          console.log(urlAPI);
          */
/*
          console.log($scope.currLocation.validations);

          $scope.validations = {
              dataSource: {
                  type: "json",
                  transport: {
                      read: $scope.currLocation
                  },
                  pageSize: 5,
//                  filter: { field: "validations._id", operator: "eq", value: validationId },
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
                  field: "name",
                  title: "Validation Table Name",
                  width: "120px"//,
                  //template: "<a href='\\#\\!/validations/{{dataItem.validations._id}}'>{{dataItem.validations.name}}</a>"
                  }]
          };*/

        };

        // Generate a new controller method for generating treelist of locations on the basis of brands as their parent
        // http://kendo-labs.github.io/angular-kendo/#/TreeView
        $scope.generateTree = function() {
          // Use the location 'query' method to send an appropriate GET request
          //   $scope.locations = Locations.query();

             $scope.treeData = new kendo.data.HierarchicalDataSource({ data: [
                { text: "Foodmark", items: [
                  { text: "Café Fahaheel" },
                  { text: "Centrepoint Café" },
                  { text: "Café Awqaf" },
                  { text: "Casa Havana" },
                  { text: "Pie Face", items: [
                    { text: "Pie face Marina" }
                  ] },
                  { text: "Carluccio", items: [
                  { text: "Carluccios Deira city centre" },
                  { text: "Carluccios DXB Airport" },
                  { text: "Carluccios Abu Dhabi" },
                  { text: "Carluccios Mangroves" },
                  { text: "Carluccios Yas Mall" },
                  { text: "Carluccios JBR" },
                  { text: "Carluccios Dubai Marina Mall" },
                  { text: "Carluccios Mirdif Citi Centre Dubai" },
                  { text: "Carluccios Dubai Mall" },
                  { text: "Carluccios Kuwait " },
                  { text: "Carluccios Doha Qatar" }
                  ] },
                  { text: "Zafran", items: [
                    { text: "Zafran Mirdif Citi Centre Dubai" },
                    { text: "Zafran Dubai Marina Mall" },
                    { text: "Zafran Kuwait" }
                  ] },
                  { text: "Max", items: [
                    { text: "Max's Abu Dhabi" },
                    { text: "Max's Karama Dubai" },
                    { text: "Max's City Centre Sharjah" }
                  ] },
                  { text: "Mango", items: [
                    { text: "Mango" }
                  ] },
                  { text: "Wild", items: [
                    { text: "Wild" }
                  ] },
                  { text: "Balance", items: [
                    { text: "Balance" }
                  ] },
                  { text: "Chizen", items: [
                    { text: "Chizen" }
                  ] },
                  { text: "Ushna", items: [
                    { text: "Ushna" }
                  ] }
                ] }
              ]});
              //$scope.itemTemplate = "{{dataItem.text}} <button ng-click='click(dataItem)'>Click</button>";

        };

        // Create a new controller method for retrieving a single location
        $scope.findOne = function() {
        	// Use the location 'get' method to send an appropriate GET request

            $scope.location = Locations.get({
                locationId: $routeParams.locationId
            });

            $scope.location.account = [{ "sales_order_no": "0", "name": "Foodmark", "country":"United Arab Emirates" }];
            $scope.location.timezone = "Asia/Dubai";

            console.log($scope.location.account[0].country);
/*
            $scope.location = $http({method: 'GET', url: 'https://official-apisurveymark.rhcloud.com/api/locations/' }).
                  success(function(data, status, headers, config) {
                      e.success(data)
                  }).
                  error(function(data, status, headers, config) {
                      alert('something went wrong')
                      console.log(status);
                  });
*/

        };

        // Create a new controller method for updating a single location
        $scope.update = function() {
        	// Use the location '$update' method to send an appropriate PUT request
            $scope.location.$update(function() {
            	// If an location was updated successfully, redirect the user to the location's page
                $location.path('locations/' + $scope.location._id);
            }, function(errorResponse) {
            	// Otherwise, present the user with the error message
                $scope.error = errorResponse.data.message;
            });
        };

        // Create a new controller method for deleting a single location
        $scope.delete = function(location) {
        	// If an location was sent to the method, delete it
            if (location) {
            	// Use the location '$remove' method to delete the location
                location.$remove(function() {
                	// Remove the location from the locations list
                    for (var i in $scope.locations) {
                        if ($scope.locations[i] === location) {
                            $scope.locations.splice(i, 1);
                        }
                    }
                });
            } else {
            	// Otherwise, use the location '$remove' method to delete the location
                $scope.location.$remove(function() {
                    $location.path('locations');
                });
            }
        };
    }
]);
