// Invoke 'strict' JavaScript mode
//'use strict';

// Create the 'accounts' controller
angular.module('accounts').controller('AccountsController', ['$scope', 'filterFilter', '$routeParams', '$location', '$http', 'Authentication', 'Accounts',
    function($scope, filterFilter, $routeParams, $location, $http, Authentication, Accounts) {
    	// Expose the Authentication service
        $scope.authentication = Authentication;

        // Create a new controller method for creating new accounts
        $scope.create = function() {
        	// Use the form fields to create a new account $resource object
            var account = new Accounts({
                title: this.title,
                content: this.content
            });

            // Use the account '$save' method to send an appropriate POST request
            account.$save(function(response) {
            	// If an account was created successfully, redirect the user to the account's page
                $location.path('accounts/' + response._id);
            }, function(errorResponse) {
            	// Otherwise, present the user with the error message
                $scope.error = errorResponse.data.message;
            });
        };

        // Create a new controller method for retrieving a list of accounts
        $scope.find = function() {
        	// Use the account 'query' method to send an appropriate GET request
            $scope.accountsCount = Accounts.query();
            console.log($scope.accountsCount);

            $scope.accounts = {
                dataSource: {
                    type: "json",
                    transport: {
                        read: "/api/accounts"
                    }/*,
                    pageSize: 5,
                    serverPaging: true,
                    serverSorting: true*/
                },
                sortable: true,
                //pageable: true,
                columns: [{
                    //field: "name",
                    title: "Account Name",
                    width: "120px",
                    template: "<a href='\\#\\!/accounts/{{dataItem._id}}'>{{dataItem.name}}</a>"
                    },{
                    //field: "country",
                    title: "Account Address",
                    width: "120px",
                    template: "{{'PO Box ' + dataItem.postalCode + ' ' + dataItem.state + ' ' + dataItem.country}}"
                    }]
            };
        };

        // Generate a new controller method for generating treelist of accounts on the basis of brands as their parent
        // http://kendo-labs.github.io/angular-kendo/#/TreeView
        $scope.generateTree = function() {

            var config = {
                method: "GET",
                url: "api/accounts/" + $scope.authentication.user.account._id + "/treeview"
            };

            $http(config).success(function(data, status, headers, config) {
                $scope.treeData1 = data;

                         $scope.treeData = new kendo.data.HierarchicalDataSource({ data: [
               { text: $scope.authentication.user.account.name, items: $scope.treeData1/*[

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
               ]*/ }
                          ]});

                          //$scope.itemTemplate = "{{dataItem.text}} <button ng-click='click(dataItem)'>Click</button>";

            }).
            error(function(data, status, headers, config) {
              // called asynchronously if an error occurs
              // or server returns response with an error status.
              console.log('data from error: ' + data);
            });

        };

        // Create a new controller method for retrieving a single account
        $scope.findOne = function() {
        	// Use the account 'get' method to send an appropriate GET request

            $scope.account = Accounts.get({
                accountId: $routeParams.accountId
            });
        };

        // Create a new controller method for updating a single account
        $scope.update = function() {
        	// Use the account '$update' method to send an appropriate PUT request
            $scope.account.$update(function() {
            	// If an account was updated successfully, redirect the user to the account's page
                $location.path('accounts/' + $scope.account._id);
            }, function(errorResponse) {
            	// Otherwise, present the user with the error message
                $scope.error = errorResponse.data.message;
            });
        };

        // Create a new controller method for deleting a single account
        $scope.delete = function(account) {
        	// If an account was sent to the method, delete it
            if (account) {
            	// Use the account '$remove' method to delete the account
                account.$remove(function() {
                	// Remove the account from the accounts list
                    for (var i in $scope.accounts) {
                        if ($scope.accounts[i] === account) {
                            $scope.accounts.splice(i, 1);
                        }
                    }
                });
            } else {
            	// Otherwise, use the account '$remove' method to delete the account
                $scope.account.$remove(function() {
                    $location.path('accounts');
                });
            }
        };

    }
]);
