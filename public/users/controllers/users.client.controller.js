// Invoke 'strict' JavaScript mode
'use strict';

// Create the 'users' controller
angular.module('users').controller('UsersController', ['$scope', '$routeParams', '$location', 'Authentication', 'Users', 'Dialogs',
    function($scope, $routeParams, $location, Authentication, Users, Dialogs) {
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
              $location.path('/#!/users/');
            },
            function() {
              //alert('No clicked');
            });
        }

        // Create a new controller method for creating new users
        $scope.create = function() {

          	// Use the form fields to create a new user $resource object
            var user = new Users({
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
                createdOn: moment.tz(Date.now(), 'Asia/Dubai'),
                createdBy: $scope.authentication.user._id
            });

            console.log(user.createdOn);
            // Use the user '$save' method to send an appropriate POST request
            user.$save(function(response) {
              console.log("create user called and success");
            	// If an user was created successfully, redirect the user to the user's page
                $location.path('users/' + response._id);
            }, function(errorResponse) {
            	// Otherwise, present the user with the error message
                $scope.error = errorResponse.data.message;
            });
        };

        // Create a new controller method for retrieving a list of users
        $scope.find = function() {
        	// Use the user 'query' method to send an appropriate GET request
          /*
            $scope.usersCount = Users.find({accountId: $scope.authentication.user.accountId}).exec(function(err, users){
                console.log('Users Total: ' + users.length());
            });
*/

          $scope.gridOptions = {
              dataSource: {
                  type: "json",
                  transport: {
                      read: ""
                  },
                  pageSize: 5,
                  serverPaging: true,
                  serverSorting: true
              },
              sortable: true,
              pageable: true,
              columns: [{
                  //field: "name",
                  title: "User Name",
                  width: "120px",
                  template: "<a href='\\#\\!/users/{{dataItem._id}}'>{{dataItem.username}}</a>"
                  },{
                  field: "firstName",
                  title: "First Name",
                  width: "120px"
                  },{
                  field: "lastName",
                  title: "Last Name",
                  width: "120px"
                  },{
                  field: "provider",
                  title: "Provider",
                  width: "120px"
                  },{
                  field: "role",
                  title: "Role",
                  width: "120px"
                  },{
                  field: "account.name",
                  title: "Account Name",
                  width: "120px"
                  }]
          };

          $scope.gridOptions.dataSource.transport.read = "/api/users/usersByAccount/" + $scope.authentication.user.account._id;

          $scope.users = $scope.gridOptions;
        };

        // Create a new controller method for retrieving a single user
        $scope.findOne = function() {
        	// Use the user 'get' method to send an appropriate GET request
            $scope.user = Users.get({
                userId: $routeParams.userId
            });

            $scope.user.account = [{ "sales_order_no": "0", "name": "Foodmark", "country":"United Arab Emirates" }];

            console.log($scope.user.account[0].country);
        };

        // Create a new controller method for updating a single user
        $scope.update = function() {
        	// Use the user '$update' method to send an appropriate PUT request
            $scope.user.$update(function() {
            	// If an user was updated successfully, redirect the user to the user's page
                $location.path('users/' + $scope.user._id);
            }, function(errorResponse) {
            	// Otherwise, present the user with the error message
                $scope.error = errorResponse.data.message;
            });
        };

        // Create a new controller method for deleting a single user
        $scope.delete = function(user) {

          $scope.associatedBrands = Brands.query({"user": user._id});

          if($scope.associatedBrands) {
            return 'User cannot be deleted, because it is already linked with the following brands:' + $scope.associatedBrands;
          }

        	// If an user was sent to the method, delete it
            if (user) {
            	// Use the user '$remove' method to delete the user
                user.$remove(function() {
                	// Remove the user from the users list
                    for (var i in $scope.users) {
                        if ($scope.users[i] === user) {
                            $scope.users.splice(i, 1);
                        }
                    }
                });
            } else {
            	// Otherwise, use the user '$remove' method to delete the user
                $scope.user.$remove(function() {
                    $location.path('users');
                });
            }
        };
    }
]);
