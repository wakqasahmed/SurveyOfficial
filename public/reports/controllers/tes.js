/**
 * Created by chakirqatab on 4/7/15.
 */
$scope.guestChecksGenerateReport = function() {
    /*  console.log($scope.locByBrand);*/


    var choices_name= [];
    var choices_id= [];


    // Use the form fields to create a new article $resource object

    // load the data

    $http.get('/api/reports/guestchecks').
        success(function(docs, status, headers, config) {
            // this callback will be called asynchronously
            // when the response is available
            //  console.log($scope.brands);
            console.log("data from success: " + JSON.stringify(docs));
            $scope.categories = [];
            $scope.values = [];
            $scope.locbydata = [];
            var series = [] ;

            var colors = ["#FFCC00","#ff88cc","#00ccff","#CC0022","#bb6666"];

            $scope.showLocations =[];

            for(var k=0;k < docs.length ;k++){
                //  console.log(" ID location "+docs[k])
                // console.log(" Value : "+k.value)


                    $scope.categories.push(docs[k]._id);
                    $scope.values.push(docs[k].value);
                    $scope.locbydata.push(docs[k]._id);


                    // var divider = field.entry.valueType=="percentage" ? Number(docs[k].value.count) :1 ;






                console.log("location ids "+ $scope.locationiD)
                var index =$scope.locationiD.indexOf(docs[k]._id)
                console.log(docs[k]._id+" index location "+ index)
                if( index> -1){
                    $scope.showLocations.push(  $scope.locationNames[index]);
                }



                // console.log($scope.locbydata);
            }
            series = {name :"" , data :$scope.values ,color :colors[2]};
            console.log(" Series "+series)
            var restOflocations = $scope.locationNames.filter(function(i) {return $scope.showLocations.indexOf(i) < 0;});


            $scope.showLocations = $scope.showLocations.concat(restOflocations);

            var chartOptions = {
                pdf: {
                    fileName: "Kendo UI Chart Export.pdf",
                    proxyURL: "http://demos.telerik.com/kendo-ui/service/export"
                },
                title: {
                    text: "Guest Checks vs Guest Survey"
                },
                legend: {
                    visible: true,
                    text:"how do find this ?"
                },
                seriesDefaults: {
                    type: "bar",
                    stack: true

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
                categories:   $scope.showLocations
            };
            chartOptions.series = series;

            $(".export-pdf").click(function() {
                // $("#chart").getKendoChart().saveAsPDF();
            });

            function createChart() {

                console.log(field.field_id+" createChart  :"+JSON.stringify(chartOptions))
                $("#chart1").kendoChart(
                    $.extend(true, {},chartOptions)
                );
            }

            field.chartOptions = chartOptions;


            $(document).ready(createChart);
            $(document).bind("kendo:skinChange", createChart);

            //Creatting the Chart
        }).
        error(function(data, status, headers, config) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
        });

    // Use the article '$save' method to send an appropriate POST request
    /*  report.$save(function(response) {
     // If an article was created successfully, redirect the user to the article's page
     //  $location.path('reports/' + response._id);
     //  console.log(response);
     }, function(errorResponse) {
     // Otherwise, present the user with the error message
     $scope.error = errorResponse.data.message;
     });*/
};




$http.get('/api/locations/active/' )
    .success(function(data, status, headers, config) {

        $scope.locationNames= []
        $scope.locationiD = [];

        $scope.locationByBrand = data;
        for(var k in data){

            $scope.locationNames.push(data[k].name);
            $scope.locationiD.push(data[k]._id);

        }

        // after loading locations

    }).
    error(function(data, status, headers, config) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
    });
