// Invoke 'strict' JavaScript mode
'use strict';

// Create the 'reports' controller
angular.module('reports').controller('reportsController', ['$scope', '$routeParams', '$location', '$http', 'Authentication', 'reports',
    function($scope, $routeParams, $location, $http, Authentication, reports) {
        // Expose the Authentication service
        $scope.authentication = Authentication;
        $scope.value = new Date(2013, 9, 1);




        // Create a new controller method for creating new reports
        $scope.create = function() {
            // Use the form fields to create a new article $resource object
            var reports = new reports({
                title: this.title,
                content: this.content
            });

            // Use the article '$save' method to send an appropriate POST request
            reports.$save(function(response) {
                // If an article was created successfully, redirect the user to the article's page
                $location.path('reports/' + response._id);
            }, function(errorResponse) {
                // Otherwise, present the user with the error message
                $scope.error = errorResponse.data.message;
            });
        };
        $scope.foodquality = function() {

            //console.log('Calling FoodQuality');

            $.ajax({
                url: '/api/reports/monthly/participationRate',
                type: 'GET',
                dataType: 'json',
                cache: 'false',
                data: {
                    'responseId': 'responseId',
                    'value': 'value'
                },

                success: function(data) {


                    window.locations = []; // saving the locations


                    window.nameOfLocation = [];
                    window.totalSurveys = [];
                    //console.log(test);
                    $.each(data, function(key, val1) {

                        locations.push(this.location);

                        nameOfLocation.push(this._id);
                        totalSurveys.push(this.value);


                    });

                    var chartOptions = {
                        pdf: {
                            fileName: "Kendo UI Chart Export.pdf",
                            proxyURL: "http://demos.telerik.com/kendo-ui/service/export"
                        },
                        title: {
                            text: "Rate Quality of Food"
                        },
                        legend: {
                            visible: false
                        },
                        seriesDefaults: {
                            type: "column"

                        },
                        valueAxis: {
                            line: {
                                visible: false
                            },
                            minorGridLines: {
                                visible: true
                            }
                        },
                        majorGridLines: {
                            visible: false
                        },
                        tooltip: {
                            visible: true,
                            template: "#= series.name #: #= value #"
                        },
                        categoryAxis: {
                            field: "category"
                        }
                    };
                    chartOptions.categoryAxis = {
                        categories: nameOfLocation
                    };
                    chartOptions.series = [{
                            name: "Excellent",
                            data: totalSurveys,
                            color: "#1F77B4"
                        }

                    ];

                    $(".export-pdf").click(function() {
                        $("#chart").getKendoChart().saveAsPDF();
                    });

                    function createChart() {
                        $("#chart").kendoChart(
                            $.extend(true, {}, chartOptions)
                        );
                    }




                    $(document).ready(createChart);
                    $(document).bind("kendo:skinChange", createChart);


                }
            });




        };

        /*   $scope.bar = function(){ // FoodQuality Bar Chart

console.log('Calling bar');

$.ajax({
    url: '../js/foodquality.json',
    type: 'GET',
    dataType: 'json',
    cache: 'false',
    data: { 'responseId': 'responseId', 'value': 'value' },

success: function(data) {


    window.locations = []; // saving the locations

    window.first = []; // saving No percentage
    window.week = [];
    window.month = []; // saving yes percentage
    $.each(data, function(key,val1) {

        locations.push( this.location);

        first.push(this.fristtime);
        week.push(this.weekly);
        month.push(this.monthly);
        //name =this.responses[0].prompt[0].value;
        //console.log(this.responses[0].prompt[0].value);

        //totalval = this.responses[0].en[0].value;




        /*for (var i = yes.length - 1; i >= 0; i--) {
                           console.log(yes[i]);
        }*/




        /*var chartOptions = {
                pdf: {
                fileName: "Kendo UI Chart Export.pdf",
                proxyURL: "http://demos.telerik.com/kendo-ui/service/export"
                },
                title: {
                    text: "How Often Visit"
                },
                legend: {
                    visible: false
                },
                seriesDefaults: {
                    type: "bar",
                    stack: {
                        type: "100%"
                    }

                },
                valueAxis: {
                    line: {
                        visible: false
                    },
                    minorGridLines: {
                        visible: true
                    }
                },
                majorGridLines: {
                    visible: false
                },
                tooltip: {
                    visible: true,
                    template: "#= series.name #: #= value #"
                },
                categoryAxis: {
                    field: "category"
                }
        };
        chartOptions.categoryAxis = { categories: locations};
        chartOptions.series = [{
                    name: "First Time",
                    data: first,
                    color: "#2CA02C"
                },
                {
                    name: "Weekly",
                    data: week,
                    color: "#FF7F0E"
                },
                {
                    name: "Monthly",
                    data: month,
                    color: "#1F77B4"
                }];


                 $(".export-pdf").click(function() {
            $("#chart1").getKendoChart().saveAsPDF();
        });

    function createChart() {
            $("#chart1").kendoChart(
                $.extend(true, {}, chartOptions)
            );
        }








        $(document).ready(createChart);
        $(document).bind("kendo:skinChange", createChart);

    }
});



        };*/

        $scope.brandName = function() {

            //console.log('Calling FoodQuality');

            $.ajax({
                url: '/api/brands',
                type: 'GET',
                dataType: 'json',
                cache: 'false',
                data: {
                    'name': 'name',
                    'value': 'value'
                },

                success: function(data) {


                    window.locations = []; // saving the locations
                    window.idt = []


                    $scope.brand = data;
                    $scope.selectedBrand = [];




                }
            });
        }


        $scope.locByBrand = [];

        $scope.selected = function() {



            for (var k in $scope.selectedBrand) {


              $scope.locByBrand.push($scope.selectedBrand[k]._id);
                 console.log($scope.locByBrand);
            };
            if($scope.locByBrand.length > 0){
            //console.log($scope.selectedId);
            $http.get('/api/locations/locationsByBrands/' + $scope.locByBrand)
                .success(function(data, status, headers, config) {
                    // this callback will be called asynchronously
                    // when the response is available
                    //console.log(data[0].name)

                    $scope.locationByBrand = data;


                }).
            error(function(data, status, headers, config) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
            });
         }
         $scope.locByBrand = [];
        };




        // Create a new controller method for retrieving a list of reports
        $scope.find = function() {
            // Use the article 'query' method to send an appropriate GET request
            $scope.reports = example_results.query();
        };

        // Create a new controller method for retrieving a single article
        $scope.findOne = function() {
            // Use the article 'get' method to send an appropriate GET request
            $scope.reports = reports.get({
                articleId: $routeParams.articleId
            });
        };

        // Create a new controller method for updating a single article
        $scope.update = function() {
            // Use the article '$update' method to send an appropriate PUT request
            $scope.article.$update(function() {
                // If an article was updated successfully, redirect the user to the article's page
                $location.path('reports/' + $scope.article._id);
            }, function(errorResponse) {
                // Otherwise, present the user with the error message
                $scope.error = errorResponse.data.message;
            });
        };

        // Create a new controller method for deleting a single article
        $scope.delete = function(article) {
            // If an article was sent to the method, delete it
            if (article) {
                // Use the article '$remove' method to delete the article
                article.$remove(function() {
                    // Remove the article from the reports list
                    for (var i in $scope.reports) {
                        if ($scope.reports[i] === article) {
                            $scope.reports.splice(i, 1);
                        }
                    }
                });
            } else {
                // Otherwise, use the article '$remove' method to delete the article
                $scope.article.$remove(function() {
                    $location.path('reports');
                });
            }
        };




    }
]);
