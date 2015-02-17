// Invoke 'strict' JavaScript mode
'use strict';

// Create the 'reports' controller
angular.module('reports').controller('ReportsController', ['$scope', '$routeParams', '$location', 'Authentication', 'Reports', 'Dialogs',
    function($scope, $routeParams, $location, Authentication, Reports, Dialogs) {
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
              $location.path('/#!/reports/');
            },
            function() {
              //alert('No clicked');
            });
        }

        // Create a new controller method for creating new reports
        $scope.staff = function() {

        };

        // Create a new controller method for creating new reports
        $scope.monthly = function() {

        };

        // Create a new controller method for retrieving a list of reports
        $scope.find = function() {
        	// Use the report 'query' method to send an appropriate GET request
          //  $scope.reports = Reports.query();

            $scope.reports = {
                dataSource: {
                    type: "json",
                    transport: {
                        read: "/api/reports"
                    },
                    pageSize: 5,
                    serverPaging: true,
                    serverSorting: true
                },
                sortable: true,
                pageable: true,
                columns: [{
                    //field: "name",
                    title: "Report Name",
                    width: "120px",
                    template: "<a href='\\#\\!/reports/{{dataItem._id}}'>{{dataItem.name}}</a>"
                    },{
                    //field: "country",
                    title: "Report Address",
                    width: "120px",
                    template: "{{'PO Box ' + dataItem.postalCode + ' ' + dataItem.state + ' ' + dataItem.country}}"
                    }]
            };
        };

        // Create a new controller method for retrieving a single report
        $scope.findOne = function() {
        	// Use the report 'get' method to send an appropriate GET request

            $scope.report = Reports.get({
                reportId: $routeParams.reportId
            });

            $scope.report.account = [{ "sales_order_no": "0", "name": "Foodmark", "country":"United Arab Emirates" }];
            $scope.report.timezone = "Asia/Dubai";

        };


    }
]);
