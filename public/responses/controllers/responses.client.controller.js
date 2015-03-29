// Invoke 'strict' JavaScript mode
//'use strict';

// Create the 'responses' controller
angular.module('responses').controller('ResponsesController', ['$scope', 'filterFilter', '$routeParams', '$location', '$http', 'Authentication',
    function($scope, filterFilter, $routeParams, $location, $http, Authentication) {
    	// Expose the Authentication service
        $scope.authentication = Authentication;

        //Data Export starts

/*
        $scope.date_range_start_obj = dateObject | date:"EEEE, MMMM d, yyyy";
        $scope.date_range_end_obj = {startDate: null, endDate: null};
*/

        $scope.time_group = true;
        $scope.time_range_from = new Date(1970, 0, 1, 00, 00, 0);
        $scope.time_range_to = new Date(1970, 0, 1, 23, 59, 0);

        // selected columns
        $scope.selection = [];

        // selected locations
        $scope.selected_locations = [];


        $scope.timeRangeReset = function(){
          $scope.time_range_from = new Date(1970, 0, 1, 00, 00, 0);
          $scope.time_range_to = new Date(1970, 0, 1, 23, 59, 0);
        }


        $scope.startChange = function() {

          var startDate = start.value(),
          endDate = end.value();

          if (startDate) {
              startDate = new Date(startDate);
              startDate.setDate(startDate.getDate());
              end.min(startDate);
          } else if (endDate) {
              start.max(new Date(endDate));
          } else {
              endDate = new Date();
              start.max(endDate);
              end.min(endDate);
          }

        }

        $scope.endChange = function() {

          var endDate = end.value(),
          startDate = start.value();

          if (endDate) {
              endDate = new Date(endDate);
              endDate.setDate(endDate.getDate());
              start.max(endDate);
          } else if (startDate) {
              end.min(new Date(startDate));
          } else {
              endDate = new Date();
              start.max(endDate);
              end.min(endDate);
          }
        }


        var start = angular.element(document.querySelector( '#start' )).kendoDatePicker({
            change: $scope.startChange
        }).data("kendoDatePicker");

        var end = angular.element(document.querySelector( '#end' )).kendoDatePicker({
            change: $scope.endChange
        }).data("kendoDatePicker");

        start.max(end.value());
        end.min(start.value());

// columns
  $scope.columnFiltering = [
    { name: 'Account ID', value:"accountId", selected: false, disabled: true },
    { name: 'Account Name', value:"accountName", selected: false, disabled: true },
    { name: 'Brand ID', value:"brandId", selected: true, disabled: false },
    { name: 'Brand Name', value:"brandName", selected: true, disabled: false },
    { name: 'Survey ID', value:"surveyId", selected: true, disabled: false },
    { name: 'Survey Name', value:"surveyName", selected: true, disabled: false },
    { name: 'Location ID', value:"locationId", selected: true, disabled: false },
    { name: 'Location Name', value:"locationName", selected: true, disabled: false },
    { name: 'Latitude/Longitude', value:"coords", selected: false, disabled: false },

    { name: 'Language', value:"language", selected: true, disabled: false },
    { name: 'Response Status', value:"status", selected: true, disabled: false },
    { name: 'Duration of questions', value:"timeTaken", selected: false, disabled: true },
    { name: 'Response Time', value:"totalTimeTaken", selected: true, disabled: false },
    { name: 'Survey Source', value:"sourceOS", selected: true, disabled: false }
  ];

// columns
  $scope.responseFiltering = [
    { name: 'Merge surveys data in one file', value:"merge_data", selected: false, disabled: true },
    { name: 'Recognize DNA answers', value:"recognize_dna", selected: false, disabled: true },
    { name: 'Export only surveys with OPT-IN acceptance', value:"opt-in", selected: false, disabled: true },
    { name: 'Include empty responses', value:"include_empty", selected: false, disabled: false }
  ];


  // helper method to get selected fruits
  $scope.selectedColumns = function selectedColumns() {
    return filterFilter($scope.columnFiltering, { selected: true });
  };

  // watch fruits for changes
  $scope.$watch('columnFiltering|filter:{selected:true}', function (nv) {
    $scope.selection = nv.map(function (column) {
      return column.name;
    });
  }, true);

  // Create a new controller method for retrieving a list of all locations irrespective of the status
  $scope.findLocations = function() {
    $http({method: 'GET', url: '/api/locations'}).
      success(function(data, status, headers, config) {
        // this callback will be called asynchronously
        // when the response is available
        $scope.allLocations = data;
      }).
      error(function(data, status, headers, config) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
      });
  };

// Create a new controller method for retrieving a list of brands with status 'active'
$scope.findSurveys = function() {
  $http({method: 'GET', url: '/api/surveys'}).
    success(function(data, status, headers, config) {
      // this callback will be called asynchronously
      // when the response is available
      $scope.allSurveys = data;
    }).
    error(function(data, status, headers, config) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
    });
};

// Create a new controller method for retrieving a list of brands with status 'active'
$scope.dataExport = function() {

//  console.log('hit from client side');
//  console.log($scope.columnFiltering);

    var reqFields =  {};/*"locationId":1,"locationName":1,"brandId" : 1,
    "surveyId" :1,
    "totalTimeTaken" : 1,
    "sourceOS" : 1,
    "createdOn" : 1 };*/

    for (var i = 0; i < $scope.columnFiltering.length; i++) {
      if($scope.columnFiltering[i].selected){
        reqFields[$scope.columnFiltering[i].value] = 1;
      }
    }

    reqFields["createdOn"] = 1;

    var reqQuery = {
      locationIds: $scope.selected_locations,
      startDate: new Date(start.value()),
      endDate: new Date(end.value()),
      startTime: $scope.time_range_from,
      endTime: $scope.time_range_to,
      surveyId: $scope.selected_survey._id
    };
/*
$scope.saveAsCsv = function() {
  var blob = new Blob([$scope.exportCsv()], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, "report.csv");
}

$scope.saveAsPdfA4 = function() {
  $scope.gridDataExport.setOptions({ pdf: { paperSize: "A4", landscape: true, allPages: true } });
  $scope.gridDataExport.saveAsPDF();
}

$scope.saveAsPdfA5 = function() {
  $scope.gridDataExport.setOptions({ pdf: { paperSize: "A5", landscape: true, allPages: true } });
  $scope.gridDataExport.saveAsPDF();
}

$scope.saveAsPdf = function() {
  $scope.gridDataExport.saveAsPDF();
}

$scope.saveAsXls = function() {
    $scope.gridDataExport.saveAsExcel();
}

$scope.exportCsv = function() {
    var csv = '';
    //add the header row
    for (var i = 0; i < $scope.gridDataExport.columns.length; i++) {
        var field = $scope.gridDataExport.columns[i].field;
        var title = $scope.gridDataExport.columns[i].title || field;

        //NO DATA
        if (!field) continue;

        title = title.replace(/"/g, '""');
        csv += '"' + title + '"';
        if (i < $scope.gridDataExport.columns.length - 1) {
            csv += ',';
        }
    }
    csv += '\n';

    var data = $scope.gridDataExport.dataSource.view();

    //add each row of data
    for (var row in data) {
        for (var i = 0; i < $scope.gridDataExport.columns.length; i++) {
            var fieldName = $scope.gridDataExport.columns[i].field;
            //var template = $scope.gridDataExport.columns[i].template;
            //var exportFormat = $scope.gridDataExport.columns[i].exportFormat;

            //VALIDATE COLUMN
            if (!fieldName) continue;
            var value = '';
            if (fieldName.indexOf('.') >= 0)
            {
            var properties = fieldName.split('.');
            var value = data[row] || '';
            for (var j = 0; j < properties.length; j++) {
                var prop = properties[j];
                value = value[prop] || '';
            }
            }
            else{

           value = data[row][fieldName] || '';
            }

            value = value.toString().replace(/"/g, '""');
            csv += '"' + value + '"';
            if (i < $scope.gridDataExport.columns.length - 1) {
                csv += ',';
            }
        }
        csv += '\n';
    }

    return csv;
}*/

$scope.locationColumns = [];
$scope.surveyColumns = [];
$scope.responseColumns = [];

$scope.locationColumns.push({field: "locationId._id", title: "Location ID"});
$scope.locationColumns.push({field: "locationId.name", title: "Location Name"});
if(reqFields.coords){
  $scope.locationColumns.push({field: "locationId.coords[0]", title: "Longitude"});
  $scope.locationColumns.push({field: "locationId.coords[1]", title: "Latitude"});
}

$scope.surveyColumns.push({ field: "surveyId._id", title: "Survey ID" });
$scope.surveyColumns.push({ field: "surveyId.name", title: "Survey Name" });

$scope.responseColumns.push({ field: "_id", title: "Response ID" });
$scope.responseColumns.push({ field: "sourceOS", title: "Source OS" });
$scope.responseColumns.push({ field: "totalTimeTaken", title: "Total Time" });
$scope.responseColumns.push({ field: "createdOn", title: "Created On" });
$scope.responseColumns.push({ field: "status", title: "Status" });
$scope.responseColumns.push({ field: "language", title: "Language" });


/*
[{field: "surveyId._id", title: "Survey ID"},
{ field: "surveyId.name", title: "Survey Name" }];
*/

$scope.data2export = {
  toolbar: ["excel", "pdf"],
  pdf: {multiPage: true, allPages: true},
    dataSource: {
        type: "json",
        transport: {
                read: function(){
                    var config = {
                        method: "POST",
                        url: "/api/responses/dataexport",
                        data:{ reqFields: reqFields, reqQuery: reqQuery }
                    };
                    $http(config).success(function(data, status, headers, config) {

                        //Survey & Response Columns Start
                        if($scope.surveyColumns.length == 2)
                        {
                          for (var i = 0; i < data[0].surveyId.questions[0].prompt.length; i++) {
                            $scope.surveyColumns.push({field: "surveyId.questions[0].prompt[" + i + "].title", title: "Prompt Question # " + i});
                          }

                          for (var i = 0; i < data[0].surveyId.questions[0].survey.length; i++) {
                            $scope.surveyColumns.push({field: "surveyId.questions[0].survey[" + i + "].titleEN", title: "Survey Question # " + i});
                          }

                          for (var i = 0; i < data[0].responses[0].data.length; i++) {
                            $scope.responseColumns.push({field: "responses[0].data[" + i + "].value", title: "Response - Question # " + i});
                            $scope.responseColumns.push({field: "responses[0].data[" + i + "].timeTaken", title: "Time Taken - Question # " + i});
                          }
                        }
                        //Survey & Response Columns End


                        $scope.gridDataExport.dataSource.data(data);
                        //console.log(data);


                        //console.log(data);
                        //$scope.gridDataExport.refresh();

                    }).
                    error(function(data, status, headers, config) {
                      // called asynchronously if an error occurs
                      // or server returns response with an error status.
                      console.log('data from error: ' + data);
                      console.log('status from error: ' + status);
                      console.log('header from error: ' + headers);
                      console.log('config from error: ' + config);
                    });
                }
              }//,
        //pageSize: 10
    },
    sortable: true,
    //pageable: true,
    columns: [
      {
        title: "Location",
        columns: $scope.locationColumns
      },
      {
        title: "Survey",
        columns: $scope.surveyColumns //[{field: "surveyId._id", title: "Survey ID"},
        //{ field: "surveyId.name", title: "Survey Name" }]
      },
      {
        title: "Response",
        columns: $scope.responseColumns
      }
    ]
};

$scope.data2export.dataSource.transport.read();


};

        //Data Export ends

    }
]);
