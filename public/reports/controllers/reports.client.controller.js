// Invoke 'strict' JavaScript mode
'use strict';

//Array.prototype.diff = function(a) {
    //return this.filter(function(i) {return a.indexOf(i) < 0;});
//};
// Create the 'reports' controller
angular.module('reports').controller('reportsController', ['$scope', '$routeParams', '$location', '$http', 'Forms', 'Dialogs', 'Authentication','filterFilter',
    function($scope, $routeParams, $location, $http, Forms, Dialogs, Authentication,filterFilter) {
        // Expose the Authentication service

        // report file name
        var report_filename = "report"

        var now = new Date();
        var n = now.getFullYear();
        var m = now.getMonth() ;
        var startD = new Date(n, m, 1);
        var endD = new Date(n, m, 1);
        endD.setMonth(endD.getMonth()+1);

        $scope.time_range_from = startD;
        $scope.time_range_to = endD;
         // date selector

        console.log(" now   "+now.toLocaleString())
        console.log(" startD   "+startD.toLocaleString())
        console.log(" endD   "+endD.toLocaleString())







        ////////////////////////////////////////



        $('#reportrange span').html(moment().subtract(29, 'days').format('MMMM D, YYYY') + ' - ' + moment().format('MMMM D, YYYY'));

        $('#reportrange').daterangepicker({
            format: 'MM/DD/YYYY',
            startDate: moment().subtract(29, 'days'),
            endDate: moment(),
            minDate: '01/01/2012',
            maxDate: '12/31/2015',
            dateLimit: { days: 60 },
            showDropdowns: true,
            showWeekNumbers: true,
            timePicker: false,
            timePickerIncrement: 1,
            timePicker12Hour: true,
            ranges: {
                'Today': [moment(), moment()],
                'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                'Last 7 Days': [moment().subtract(6, 'days'), moment()],
                'Last 30 Days': [moment().subtract(29, 'days'), moment()],
                'This Month': [moment().startOf('month'), moment().endOf('month')],
                'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
            },
            opens: 'left',
            drops: 'down',
            buttonClasses: ['btn', 'btn-sm'],
            applyClass: 'btn-primary',
            cancelClass: 'btn-default',
            separator: ' to ',
            locale: {
                applyLabel: 'Submit',
                cancelLabel: 'Cancel',
                fromLabel: 'From',
                toLabel: 'To',
                customRangeLabel: 'Custom',
                daysOfWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr','Sa'],
                monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                firstDay: 1
            }
        }, function(start, end, label) {
            console.log(start.toISOString(), end.toISOString(), label);

            startD = start.toISOString() ;
            endD = end.toISOString() ;

            $('#reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
        });
        /////////// ///          /// //////////


              // Days to be selected for the reports.
        $scope.days = [
          { name: 'Sunday', value:'Sun',    selected: false },
          { name: 'Monday', value:'Mon',   selected: false },
          { name: 'Tuesday', value:'Tue',     selected: false },
          { name: 'Wednesday', value:'Wed', selected: false },
          { name: 'Thursday', value:'Thu',    selected: false },
          { name: 'Friday', value:'Fri',   selected: false }

        ];
        $scope.selection = [];// saving the selected days

        // helper method to get selected Days
        $scope.selectedDays = function selectedDays() {
          return filterFilter($scope.days, { selected: true });
        };

        // watch Days for changes
        $scope.$watch('days|filter:{selected:true}', function (nv) {
          $scope.selection = nv.map(function (day) {
            return day.name;

          });
        }, true);

      //  shifts:[{value:"breakfast",from:5,to:12},{value:"lunch",from:12,to:18},{value:"dinner",from:18,to:23},{value:"brunch",from:0,to:4}] ,

        $scope.shifts = [
          { name: 'Breakfast',  value:"breakfast",from:5,to:12,  selected: false },
          { name: 'Lunch',  value:"lunch",from:12,to:18, selected: false },
          { name: 'Dinner',   value:"dinner",from:18,to:23 ,  selected: false },
          { name: 'Graveyard', value:"graveyard",from:0,to:4 , selected: false }

        ];

        // selected Shifts
        $scope.selectionShift = [];

        // helper method to get selected Shifts
        $scope.selectedShifts = function () {
          return filterFilter($scope.shifts, { selected: true });
        };

        // watch Shifts for changes
        $scope.$watch('shifts|filter:{selected:true}', function (nv) {
          $scope.selectionShift = nv.map(function (shift) {
            return shift.name;

          });
        }, true);
        // Function for getting the brandnames

        $scope.brandName = function(selectAll) {

            console.log(" -------> brandName")



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
                    // window.idt = []


                    $scope.brand = data;
                    $scope.selectedBrand = []; // saving the selected brand

                    if(selectAll)
                    $scope.selectedBrand = data ;
                //    $scope.selectedBrandId = data[0]._id;
                  /*  for (var k in data){

                    $scope.selectedBrandId.push(data[k]._id);
                  }*/





                  /*  for(var k in data){
                      $scope.selectedBrandName = [];
                    $scope.selectedBrandName.push(data[k].name);
                    console.log($scope.selectedBrandName);
                  }*/




                }
            });
        }


                 $scope.locByBrand = [];
        //  $scope.nameByBrand = [];
        // new survey
        $scope.form = {};
        $scope.form.form_id = 1;
        $scope.form.form_name = 'My Form';
        $scope.form.form_type = '';
        $scope.form.form_fields = [];
        $scope.form.prompt_fields = [];

        // previewForm - for preview purposes, form will be copied into this
        // otherwise, actual form might get manipulated in preview mode
        $scope.previewForm = {};


        // add new field drop-down:
        $scope.addField = {};
        $scope.addField.types = Forms.fields;



        // add new prompt drop-down:
        $scope.addPrompt = {};
        //$scope.addPrompt.types = $scope.activeLocations[0].validations;
        //$scope.addPrompt.new = $scope.addPrompt.types[0]._id;
        $scope.addPrompt.lastAddedID = 0;

        // accordion settings
        $scope.accordion = {}
        $scope.accordion.oneAtATime = true;

        // accordion prompt settings
        $scope.accordionPrompt = {}
        $scope.accordionPrompt.oneAtATime = true;
        //function to get the surveyTypes

        $scope.SurveyTypes = function() {
          $http({method: 'GET', url: '/api/surveys'}).
            success(function(data, status, headers, config) {
              // this callback will be called asynchronously
              // when the response is available
              for(var k in data){
              $scope.surveyTypes = data[k]._id;
          //    console.log(   $scope.surveyTypes);
            }
            }).
            error(function(data, status, headers, config) {
              // called asynchronously if an error occurs
              // or server returns response with an error status.
            });
        };

        $scope.selectedQuestion = [];
        $scope.selectedChoices =[];

        $scope.selectedQuestionCh = [];
        //Function for selected questions


        $scope.QuestionsChoices = function(field) {

            console.log("scope.selectedQuestion  "+$scope.selectedQuestion);

           // $scope.choicesMade = [{textEN:field.field_selectedQuestionID,value:"chakir"},{textEN:"Waqas",value:"waqas"}];
           // $scope.selectedChoices =[{value:"first",textEN:"First"}];
            $http({method: 'GET', url: '/api/surveys/questions'}).
                success(function(data, status, headers, config) {





                    //console.log("data "+JSON.stringify(data));

                    for (var ch in   data){


                        $scope.temp = data[ch]._id[ch].survey;
                        //  console.log($scope.Id);
                        //  temp.push(data[ch]._id[ch].survey);
                        //console.log($scope.temp);

                        for (var t in   $scope.temp)
                        {
                           if($scope.temp[t]._id == field.field_selectedQuestionID)
                            $scope.choicesMade = $scope.temp[t].choices;
                            //console.log($scope.choicesMade);
                           // $scope.selectedChoices = [];

                            //  $scope.choices.push($scope.temp[t].choices);
                            //  console.log($scope.selectedChoices);
                        }
                    }



                }).
                error(function(data, status, headers, config) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });

        }

        $scope.Questions = function() {
          $http({method: 'GET', url: '/api/surveys/questions'}).
            success(function(data, status, headers, config) {
              // this callback will be called asynchronously
              // when the response is available
              for(var k in data){
              //$scope.questions = data[k].id[k].en;
              $scope.questions = data[k]._id[k].survey;
              //console.log($scope.questions);
            //  $scope.selectedQuestion = [];



            }

              //console.log(data[0]._id[0].ar[0].title);
            //  $scope.name = data[0]._id[0].en[0].title;
            //  $scope.Id = data[0]._id[0]._id;


              /*var cho = [];
              cho.push(data);
              console.log(cho);*/


            $scope.choices= [];
            $scope.surveychoice = [];


              for (var ch in data){

                $scope.name = data[ch]._id[ch].survey[ch].titleEN;

                $scope.Id = data[ch]._id[ch].survey[ch]._id;
                $scope.temp = data[ch]._id[ch].survey;
              //  console.log($scope.Id);
              //  temp.push(data[ch]._id[ch].survey);
                //console.log($scope.temp);

               for (var t in   $scope.temp)
                {
                  $scope.choicesMade = $scope.temp[t].choices;
                  //console.log($scope.choicesMade);
                 // $scope.selectedChoices = [];

                //  $scope.choices.push($scope.temp[t].choices);
                //  console.log($scope.selectedChoices);
                }
              }

              /*  for (var s in $scope.choices){
                  $scope.surveychoice.push($scope.choices[s].choices)
                  console.log(  $scope.surveychoice);

                }*/


            }).
            error(function(data, status, headers, config) {
              // called asynchronously if an error occurs
              // or server returns response with an error status.
            });
        };

      //  $scope.brandName();

        //Adding new Question Field
        $scope.addNewField = function(){

            // incr field_id counter
            $scope.addField.lastAddedID++;
            $scope.nameByBrand = [];
            $scope.locationByBrands = [];
            $scope.selectedBrandId;

            console.log(" selected Brands length " + $scope.selectedBrand.length);
            for (var k in $scope.selectedBrand) {


              $scope.nameByBrand.push($scope.selectedBrand[k].name);
             // $scope.selectedBrandId =($scope.selectedBrand[k]._id);

              /*if($scope.selectedBrandId.length > 1 ){
                console.log($scope.selectedBrandId.length);
              }*/



          //  console.log($scope.locationByBrands);

            };
            $scope.locationByBrandId = [];

            for(var l in $scope.locationByBrand ){

              $scope.locationByBrands.push($scope.locationByBrand[l].name);
              $scope.locationByBrandId.push($scope.locationByBrand[l]._id);
            //  console.log($scope.locationByBrandId);
          //    console.log($scope.nameByBrand);
            }

            for (var i = 0; i <   $scope.selectedQuestion.length; i++) {



            var newField = {
                "field_id" :  "FL"+$scope.form.form_fields.length,
                "field_titleEN" : $scope.selectedQuestion[i].titleEN,
              //  "field_titleAR" : $scope.addField.lastAddedID,
                //"field_type" : $scope.surveyTypes[0].name,
                //"field_value" : "",
                //"field_required" : true,
                //"field_disabled" : false,
                //"field_order": $scope.addField.lastAddedID,
                //"field_brands": $scope.nameByBrand,
                //"field_locations": $scope.locationByBrands,

                "field_brandID": $scope.selectedBrandId,
                "field_selectedQuestionID": $scope.selectedQuestion[i]._id,
                "field_choices": $scope.choices[i] ,
                "chartName": "Chart Title "+$scope.form.form_fields.length,
                "entry.valueType":"rate"
                //"entry":{client:"avg"}
            };

            // put newField into fields array
                console.log(" push newField "+newField);
            $scope.form.form_fields.push(newField);
          }
        }

        // add new option to the field






        // Create a new controller method for creating new reports
        $scope.dynamicGenerateReport = function(field) {
      /*  console.log($scope.locByBrand);*/
        console.log("field:"+JSON.stringify(field));

            console.log($scope.selectedChoices +" $scope.selectedChoices ")
            console.log(" radio button"+field.entry.client);

            var choices_name= [];
            var choices_id= [];

            if(field.selectedChoices){
                console.log( "selectedChoices "+field.selectedChoices.length )
                for ( var i=0 ; i< field.selectedChoices.length ; i++){
                    choices_id.push(field.selectedChoices[i].value+"");
                    choices_name.push(field.selectedChoices[i].textEN);
                }
            }
            // Use the form fields to create a new article $resource object
            var data ={
                //TotalCheck: this.checks
                'startDate': startD,//field.field_brandID,
                'endDate': endD,
                'brandId': $scope.selectedBrandIds,//field.field_brandID,
              'questionId': field.field_selectedQuestionID
                                  //,shifts:[{value:"breakfast",from:5,to:12},{value:"lunch",from:12,to:18},{value:"dinner",from:18,to:23},{value:"brunch",from:0,to:4}] ,

                                  //days:["Thu","Wed","Mon","Sun","Fri","Sat"]
                                // , type:"avg"
                //content: this.content
            };
            if(field.entry.client =="avg"){
                data.type = "avg"
            }else
            if(field.entry.client == "choices"){
                data.choices = choices_id
            }else if(field.entry.client == "shifts"){
                  data.shifts =   $scope.selectedShifts() ;//[{value:"breakfast",from:5,to:12},{value:"lunch",from:12,to:18},{value:"dinner",from:18,to:23},{value:"brunch",from:0,to:4}] ,
//                     ;
                choices_name =[];
                for ( var i=0 ; i< data.shifts.length ; i++){

                    choices_name.push(data.shifts[i].name);
                }

            }else if(field.entry.client == "days"){
               data.days =[];
                for ( var i=0 ; i< $scope.selectedDays().length ; i++){
                    data.days.push($scope.selectedDays()[i].value)
                    choices_name.push($scope.selectedDays()[i].name);
                }

            }
         // load the data
            console.log(" ---- startD   "+startD.toLocaleString());
            var dd=moment(startD).format('l') ;
            var ed = moment(endD).format('l') ;
            report_filename = "brands_report_"+dd+"_"+ed ;

            $http.post('/api/reports/dynamic', data).
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

                      if(field.entry.client=="avg"){

                          if(series[0])
                          series[0].data.push( docs[k].value.sum / docs[k].value.count);
                          else
                           series[0] = {name:"AVG",data:[docs[k].value.sum / docs[k].value.count],color:function(point) {
                               if (point.value > 11) {
                                   return "#006600";
                               }else{
                                   return "#660000";
                               }

                               // use the default series theme color
                           }};

                      }else {
                          $scope.categories.push(docs[k].value.valuesNrate[0]);
                          $scope.values.push(docs[k].value.valuesNrate[1]);
                          $scope.locbydata.push(docs[k]._id);


                      // var divider = field.entry.valueType=="percentage" ? Number(docs[k].value.count) :1 ;

                      for (var d = 0 ; d < $scope.categories[k].length ; d++){
                          if(series[d])
                           series[d].data.push( $scope.values[k][d]);
                          else
                           series[d] = {name :choices_name[d] , data :[ $scope.values[k][d]] ,color :colors[d]};
                      }
                      }
                          console.log("location ids "+ $scope.locationiD)
                         var index =$scope.locationiD.indexOf(docs[k]._id)
                          console.log(docs[k]._id+" index location "+ index)
                          if( index> -1){
                              $scope.showLocations.push(  $scope.locationNames[index]);
                          }



                     // console.log($scope.locbydata);
                    }
                    console.log(" Series "+series)
                   var restOflocations = $scope.locationNames.filter(function(i) {return $scope.showLocations.indexOf(i) < 0;});
                    console.log(" locationNames  "+$scope.locationNames);
                    console.log(" showLocations "+$scope.showLocations);

                    $scope.showLocations = $scope.showLocations.concat(restOflocations);


                    if($scope.locbydata == $scope.locationiD )
                    {

                      $scope.showLocations = $scope.locationNames;
                      console.log($scope.showLocations);
                    }


                    var chartOptions = {
                        pdf: {
                            fileName: "Kendo UI Chart Export.pdf",
                            proxyURL: "http://demos.telerik.com/kendo-ui/service/export"
                        },
                        title: {
                            text: field.chartName
                        },
                        legend: {
                            visible: true,
                            text:"how do find this ?"
                        },
                        seriesDefaults: {
                            type: "bar",
                            stack: (field.entry.valueType=="percentage" ?{type:"100%"}:true ),
                            labels: {
                                visible: true,
                                background: "transparent"
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
                    chartOptions.categoryAxis = {
                        categories:   $scope.showLocations
                    };
                    chartOptions.series = series;

                    $(".export-pdf").click(function() {
                       // $("#chart").getKendoChart().saveAsPDF();
                    });

                    function createChart() {

                        console.log(field.field_id+" createChart  :"+JSON.stringify(chartOptions))
                        $("#Chart"+field.field_id).kendoChart(
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
        $(".export-pdf").click(function() {
           // $scope.exportPDF();
        });

        $scope.exportPDF = function() {
            // Convert the DOM element to a drawing using kendo.drawing.drawDOM
            console.log("-- exportPDF ");
            $("#fieldsContainer").css("visibility","visible");

            kendo.drawing.drawDOM($(".charts-container"))
                .then(function(group) {
                    // Render the result as a PDF file
                    return kendo.drawing.exportPDF(group, {
                        paperSize: "auto",
                        margin: { left: "1cm", top: "1cm", right: "1cm", bottom: "1cm" }
                    });
                })
                .done(function(data) {
                    // Save the PDF file
                    kendo.saveAs({
                        dataURI: data,
                        fileName: report_filename+".pdf",
                        proxyURL: "http://demos.telerik.com/kendo-ui/service/export"
                    });
                });
        }


        $scope.dynamicGenerateStuffReport = function(field) {
            /*  console.log($scope.locByBrand);*/
            console.log(" dynamicGenerateStuffReport field:"+JSON.stringify(field));



            var choices_name= [];
            var choices_id= [];

            if(field.selectedChoices){
                console.log( "selectedChoices "+field.selectedChoices.length )
                for ( var i=0 ; i< field.selectedChoices.length ; i++){
                    choices_id.push(field.selectedChoices[i].value+"");
                    choices_name.push(field.selectedChoices[i].textEN);
                }
            }
            // Use the form fields to create a new article $resource object
            var data ={
                //TotalCheck: this.checks
                'startDate': startD,//field.field_brandID,
                'endDate': endD,
                'brandId': $scope.selectedBrandIds,//field.field_brandID,
                'questionId': field.field_selectedQuestionID
                //,shifts:[{value:"breakfast",from:5,to:12},{value:"lunch",from:12,to:18},{value:"dinner",from:18,to:23},{value:"brunch",from:0,to:4}] ,

                //days:["Thu","Wed","Mon","Sun","Fri","Sat"]
                // , type:"avg"
                //content: this.content
            };
            if(field.entry.client =="avg"){
                data.type = "avg"
            }else
            if(field.entry.client == "choices"){
                data.choices = choices_id
            }else if(field.entry.client == "shifts"){
                data.shifts =   $scope.selectedShifts() ;//[{value:"breakfast",from:5,to:12},{value:"lunch",from:12,to:18},{value:"dinner",from:18,to:23},{value:"brunch",from:0,to:4}] ,
//                     ;
                choices_name =[];
                for ( var i=0 ; i< data.shifts.length ; i++){

                    choices_name.push(data.shifts[i].name);
                }

            }else if(field.entry.client == "days"){
                data.days =[];
                for ( var i=0 ; i< $scope.selectedDays().length ; i++){
                    data.days.push($scope.selectedDays()[i].value)
                    choices_name.push($scope.selectedDays()[i].name);
                }

            }
            //  console.log(report.TotalCheck);
            var dd=moment(startD).format('l') ;
            var ed = moment(endD).format('l') ;

            report_filename = "brands_staff_report_"+dd +"_"+ed ;

            $http.post('/api/reports/dynamicstuff', data).
                success(function(docs, status, headers, config) {
                    // this callback will be called asynchronously
                    // when the response is available
                    //  console.log($scope.brands);
                    console.log(" data from success: " + JSON.stringify(docs));
                    $scope.categories = [];
                    $scope.values = [];
                    $scope.locbydata = [];
                    var series = [] ;

                    var mygroup ={};
                    var locationGroup={}
                    var staffIs={}

                    var colors = ["#FFCC00","#ff88cc","#00ccff","#CC0022","#bb6666"];

                    $scope.showLocations =[];

                    for(var k=0;k < docs.length ;k++){
                        //  console.log(" ID location "+docs[k])
                        // console.log(" Value : "+k.value)


                        if(field.entry.client=="avg"){

                            if(series[0])
                                series[0].data.push( docs[k].value.sum / docs[k].value.count);
                            else
                                series[0] = {name:"AVG",data:[docs[k].value.sum / docs[k].value.count],color:function(point) {
                                    if (point.value > 11) {
                                        return "#006600";
                                    }else{
                                        return "#660000";
                                    }

                                    // use the default series theme color
                                }};

                        }else {
                            $scope.categories.push(docs[k].value.valuesNrate[0]);
                            $scope.values.push(docs[k].value.valuesNrate[1]);
                            $scope.locbydata.push(docs[k]._id);


                            // var divider = field.entry.valueType=="percentage" ? Number(docs[k].value.count) :1 ;

                            if(!locationGroup[docs[k]._id.locationId]){
                                locationGroup[docs[k]._id.locationId]={}


                                  // categories label reorder .
                                var index =$scope.locationiD.indexOf(docs[k]._id.locationId)
                                console.log(docs[k]._id.locationId+" index location "+ index)
                                if( index> -1){
                                    $scope.showLocations.push(  $scope.locationNames[index]);
                                }
                                /////////


                            }
                            locationGroup[docs[k]._id.locationId][docs[k]._id.staffId] = docs[k].value.valuesNrate ;


                            staffIs[docs[k]._id.staffId]=true;




                        }

                        series =[]


                        // console.log($scope.locbydata);
                    }
                    console.log("locationGroup "+ JSON.stringify( locationGroup));
                    console.log("staffIs "+ JSON.stringify( staffIs));
                    console.log(" Series "+series)

                    for (var staff in staffIs){
                        for ( var l in locationGroup){
                            if(!locationGroup[l][staff])
                                locationGroup[l][staff] = [docs[0].value.valuesNrate[0],[0,0,0]]
                        }
                    }
                    var ser={}
                    for ( var l in locationGroup){

                        for (var staff in locationGroup[l]){
                         //  if(!ser[l])ser[l]={series:[]};
                           // ser[l].series.push()
                           for ( var i in locationGroup[l][staff][0]){
                               if(!ser[staff+"-"+choices_name[i]]) ser[staff+"-"+choices_name[i]] =   {stack:{group:staff },name :choices_name[i] , data :[ locationGroup[l][staff][1][i]] ,color :colors[i]} ;
                                else
                                   ser[staff+"-"+choices_name[i]].data.push(locationGroup[l][staff][1][i])

                           }
                        }

                    }
                    for ( var o in ser){

                        series.push(ser[o]);
                    }
                  //  console.log("new ser "+ JSON.stringify( ser));
                  //  console.log("new locationGroup "+ JSON.stringify( locationGroup));
                    var restOflocations = $scope.locationNames.filter(function(i) {return $scope.showLocations.indexOf(i) < 0;});
                    //console.log(" locationNames  "+$scope.locationNames);
                    //console.log(" showLocations "+$scope.showLocations);

                    $scope.showLocations = $scope.showLocations.concat(restOflocations);





                    var chartOptions = {
                        pdf: {
                            fileName: "Kendo UI Chart Export.pdf",
                            proxyURL: "http://demos.telerik.com/kendo-ui/service/export"
                        },
                        title: {
                            text: field.chartName
                        },
                        legend: {
                            visible: false,
                            text:"how do find this ?"
                        },
                        seriesDefaults: {
                            type: "bar",
                            stack: (field.entry.valueType=="percentage" ?{type:"100%"}:true ),
                            labels: {
                                visible: true,
                                background: "transparent"
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
                            template: "Staff :#= series.stack.group #, #= series.name # : #= value # "
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
                        $("#Chart"+field.field_id).kendoChart(
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
        $(".export-pdf").click(function() {
            $scope.generateChartPDFContainer();
            $scope.exportPDF();
        });


        $scope.generateChartPDFContainer = function(){
            console.log("-- generateChartPDFContainer")
            var seriesData=[];


           // $(".charts-container").prependTo("<div id='fieldsContainer'></div>")
            for ( var f = 0 ; f < $scope.form.form_fields.length ; f++){
                var optionsChart =  $scope.form.form_fields[f].chartOptions ;
                $("#fieldsContainer").append("<div id='c"+f+"'></div>");
                $("#c"+f).kendoChart(
                    $.extend(true, {},optionsChart)
                );;
                $("#fieldsContainer").append("<div> <hr></div>");
            }
        }
        $scope.generateCombinedChart = function () {

           /* var seriesData=[];
            for ( var f = 0 ; f < $scope.form.form_fields.length ; f++){
                var optionsChart =  $scope.form.form_fields[f].chartOptions ;
                $(".charts-container").append("<div id='c"+f+"'></div>");
                $("#c"+f).kendoChart(
                    $.extend(true, {},optionsChart)
                );;
                $(".charts-container").append("<div> <hr></div>");
            }
           */

            $("#fieldsContainer").css("visibility","hidden");
            var seriesData=[];

            for ( var field = 0 ;field < $scope.chartsToCombine.length ; field++){
               // console.log( " --  "+JSON.stringify($scope.chartsToCombine[field].chartOptions ));
              var options = jQuery.extend(true, {},  $scope.chartsToCombine[field].chartOptions );;
                options.seriesDefaults.type = "column" ;
                options.chartArea={height : 200} ;
                if(field != $scope.chartsToCombine.length-1)
                options.categoryAxis.visible = false;
                options.legend.visible=false;
                for(var i=0 ; i<options.categoryAxis.categories.length ; i++ ){

                 seriesData.push({
                    location: options.categoryAxis.categories[i],
                    value:  options.series[0].data[i]

                })

                }

                $(".charts-container").append("<div id='chart"+field+"'></div>");


                $("#chart"+field).kendoChart(
                    $.extend(true, {},options)
                );
            }
            $(".charts-container").append("<div> <hr></div>");
            $(".charts-container").append("<div id='chart'></div>");
            $("#chart").kendoChart({
                title: {
                    text: "Combined Weighted Average"
                },
                dataSource: {
                    data: seriesData
                },
                series: [{
                    field: "value",
                    categoryField: "location",
                    aggregate: "avg"
                }]
            });
        }

        $scope.averageFields =function(){
            console.log("------------------- averageFields ");
            for ( var f in $scope.form.form_fields)
            console.log(" averageFields "+JSON.stringify($scope.form.form_fields[f]) )
            return filterFilter($scope.form.form_fields, { "entry":{ "client":"avg"} });
           // console.log("======= "+$scope.avgf)
        }



        $scope.selected = function(field) {
           // $scope.averageFields()
            if(field)
          console.log( "choices "+ field.selectedChoices ) ;
            console.log(" chartsToCombine :"+$scope.chartsToCombine )
            console.log($scope.selectedBrandId);
      //  console.log($scope.Id);
        //console.log($scope.selectedQuestion);

        //$scope.SelectedQuestionID = $scope.selectedQuestion;
        //$scope.SelectedQuestionIDs = $scope.SelectedQuestionID[0]._id;
        //console.log($scope.SelectedQuestionIDs)

            $scope.selectedBrandIds = [];


            for (var k in $scope.selectedBrand) {


              $scope.locByBrand.push($scope.selectedBrand[k]._id);
                $scope.selectedBrandIds.push($scope.selectedBrand[k]._id);
        //         console.log($scope.locByBrand);
            };
            $scope.selectedBrandId = $scope.locByBrand[0];

            console.log("  scope.selectedBrandId "+  $scope.selectedBrandId);
            /*for (var k in $scope.selectedBrand) {


              $scope.nameByBrand.push($scope.selectedBrand[k].name);
                 console.log($scope.nameByBrand);
            };*/


            if($scope.locByBrand.length > 0){
            //console.log($scope.selectedId);
            $http.get('/api/locations/locationsByBrands/' + $scope.locByBrand)
                .success(function(data, status, headers, config) {
                    // this callback will be called asynchronously
                    // when the response is available
                    //console.log(data[0].name)
              //      console.log(data);
              $scope.locationNames= []
              $scope.locationColors= [];
              $scope.locationiD = [];

                    $scope.locationByBrand = data;
                    for(var k in data){

                    $scope.locationNames.push(data[k].name);
                    $scope.locationiD.push(data[k]._id);
                        $scope.locationColors.push(data[k].brand.color);

                  }
                    console.log("locationIDs :" + $scope.locationiD);
                    console.log("locationNames :" + $scope.locationNames);



                }).
            error(function(data, status, headers, config) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
            });
         }
         $scope.locByBrand = [];
      //   $scope.nameByBrand = [];
      //console.log();
      //console.log($scope.locationByBrand);

        };



        $scope.example1model = [];
        $scope.example1data = [ {id: 1, label: "David"}, {id: 2, label: "Jhon"}, {id: 3, label: "Danny"}];

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



        // generate guest checks vs guest survey //   //
        ////////////////////////////////////////////////

        $scope.guestChecksGenerateReport = function() {
            /*  console.log($scope.locByBrand);*/
            var dd=moment(startD).format('l') ;
            var ed = moment(endD).format('l') ;
            report_filename = "GuestChecks_VS_GuestSurvey_report_"+dd+"_"+ed ;


            var choices_name= [];
            var choices_id= [];




            $http.get('/api/locations/active/' )
                .success(function(data, status, headers, config) {

                    $scope.locationNames= []
                    $scope.locationiD = [];
                    $scope.locationColors= [];

                    $scope.locationByBrand = data;
                    for(var k in data){

                        $scope.locationNames.push(data[k].name);
                        $scope.locationiD.push(data[k]._id);



                        $scope.locationColors.push(data[k].brand.color);

                          console.log(" data["+k+"].brand.color   "+data[k].brand.color);
                    }

                    // after loading locations
                    $scope.loadGuestchecks();
                    $scope.loadGuestSurveys();
                    setTimeout(function(){

                    if($scope.chartOptions1 && $scope.chartOptions2){
                        $scope.createGuestCheckVsGuestSurveyPercent();

                    }

                    },1000);

                }).
                error(function(data, status, headers, config) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });




        };
                // load  guest checks //
        $scope.loadGuestchecks = function (){



            var data ={
                //TotalCheck: this.checks
                'startDate': startD,//field.field_brandID,
                'endDate': endD
                //,shifts:[{value:"breakfast",from:5,to:12},{value:"lunch",from:12,to:18},{value:"dinner",from:18,to:23},{value:"brunch",from:0,to:4}] ,

                //days:["Thu","Wed","Mon","Sun","Fri","Sat"]
                // , type:"avg"
                //content: this.content
            };

            $http.post('/api/reports/guestchecks',data).
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

                        console.log("location ids "+ $scope.locationiD)
                        var index =$scope.locationiD.indexOf(docs[k]._id)
                        console.log(docs[k]._id+" index location "+ index)
                        if( index> -1){
                            $scope.categories.push(docs[k]._id);
                            $scope.values.push(docs[k].value);
                            $scope.locbydata.push(docs[k]._id);
                            $scope.showLocations.push(  $scope.locationNames[index]);
                        }



                        // console.log($scope.locbydata);
                    }
                    series = [{name :"Guest checks" , data :$scope.values ,color :function(point) { console.log("  point "+point.index);

                    return $scope.locationColors[point.index];

                    }}];
                    console.log(" Series "+series)
                    var restOflocations = $scope.locationNames.filter(function(i) {return $scope.showLocations.indexOf(i) < 0;});


                    $scope.showLocations = $scope.showLocations.concat(restOflocations);

                    var chartOptions = {
                        pdf: {
                            fileName: "Kendo UI Chart Export.pdf",
                            proxyURL: "http://demos.telerik.com/kendo-ui/service/export"
                        },
                        title: {
                            text: "Guest Checks vs  Guest Survey "
                        },
                        chartArea:{height:300},
                        legend: {
                            visible: false,
                            text:"how do find this ?"
                        },
                        seriesDefaults: {
                            type: "column",
                            labels: {
                                visible: true,
                                background: "transparent"
                            }

                        },
                        valueAxis: {
                            line: {
                                visible: false
                            },
                            minorGridLines: {
                                visible: true
                            },
                            title: {
                                text: "Guest checked"
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
                            visible :false,
                            field: "category"
                        }
                    };
                    chartOptions.categoryAxis = {
                        categories:   $scope.showLocations ,
                        visible :false
                    };
                    chartOptions.series = series;


                    $scope.chartOptions2 = chartOptions;

                    $(".export-pdf").click(function() {
                        // $("#chart").getKendoChart().saveAsPDF();
                    });

                    function createChart() {

                        //  console.log(field.field_id+" createChart  :"+JSON.stringify(chartOptions))
                        $("#chart1").kendoChart(
                            $.extend(true, {},chartOptions)
                        );
                    }

                    // field.chartOptions = chartOptions;


                    $(document).ready(createChart);
                    $(document).bind("kendo:skinChange", createChart);

                    //Creatting the Chart
                }).
                error(function(data, status, headers, config) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });
        }

        $scope.loadGuestSurveys = function (){
            var data ={

                'startDate': startD,//field.field_brandID,
                'endDate': endD

            };

            $http.post('/api/reports/monthly/participationRate', data).
                success(function(docs, status, headers, config) {
                    // this callback will be called asynchronously
                    // when the response is available
                    //  console.log($scope.brands);
                  //  console.log("data from success: " + JSON.stringify(docs));
                    var categories = [];
                    var values = [];
                    var locbydata = [];
                    var series = [] ;

                    var colors = ["#FFCC00","#ff88cc","#00ccff","#CC0022","#bb6666"];

                    $scope.showLocations =[];

                    for(var k=0;k < docs.length ;k++){

                        //console.log("location ids "+ $scope.locationiD)
                        var index =$scope.locationiD.indexOf(docs[k]._id)
                        console.log(docs[k]._id+" index location "+ index)
                        if( index> -1){
                            categories.push(docs[k]._id);
                            values.push(docs[k].value);
                            locbydata.push(docs[k]._id);
                            $scope.showLocations.push(  $scope.locationNames[index]);
                        }

                    }
                    series = [{name :"Guest Survey" , data :values ,color :function(point) {

                        return $scope.locationColors[point.index];

                    }}];
                    console.log(" Series "+series)
                    var restOflocations = $scope.locationNames.filter(function(i) {return $scope.showLocations.indexOf(i) < 0;});


                    $scope.showLocations = $scope.showLocations.concat(restOflocations);

                    var chartOptions = {
                        pdf: {
                            fileName: "Kendo UI Chart Export.pdf",
                            proxyURL: "http://demos.telerik.com/kendo-ui/service/export"
                        },
                        title: {
                            text: ""
                        },
                        chartArea:{height:300},
                        legend: {
                            visible: false,
                            text:"how do find this ?"
                        },
                        seriesDefaults: {
                            type: "column",
                            labels: {
                                visible: true,
                                background: "transparent"
                            }

                        },
                        valueAxis: {
                            line: {
                                visible: false
                            },
                            minorGridLines: {
                                visible: true
                            },
                            title: {
                                text: "Guest Surveys"
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


                    $scope.chartOptions1 = chartOptions;

                    $(".export-pdf").click(function() {
                        // $("#chart").getKendoChart().saveAsPDF();
                    });

                    function createChart() {

                        //  console.log(field.field_id+" createChart  :"+JSON.stringify(chartOptions))
                        $("#chart2").kendoChart(
                            $.extend(true, {},chartOptions)
                        );
                    }

                    // field.chartOptions = chartOptions;


                    $(document).ready(createChart);
                    $(document).bind("kendo:skinChange", createChart);

                    //Creatting the Chart
                }).
                error(function(data, status, headers, config) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });
        }

        $scope.createGuestCheckVsGuestSurveyPercent = function(){


          var calculData = [];
            for ( var i=0 ; i < $scope.chartOptions1.series[0].data.length ; i++ ){
                console.log("   i  ="+$scope.chartOptions2.series[0].data[i])

                calculData[i] = $scope.chartOptions1.series[0].data[i]/$scope.chartOptions2.series[0].data[i] ;
            }

            $scope.chartOptions2.series.push($scope.chartOptions1.series[0]);
            $scope.chartOptions2.seriesDefaults.type = "bar";
            $scope.chartOptions2.categoryAxis.visible = true;
            $scope.chartOptions2.title= "Guest check vs Guest survey 2";

           // $scope.chartOptions2.series[0].data = calculData ;




            function createChart() {

                //  console.log(field.field_id+" createChart  :"+JSON.stringify(chartOptions))
                $("#chart4").kendoChart(
                    $.extend(true, {}, $scope.chartOptions2)
                );


               // $scope.chartOptions2.series.push($scope.chartOptions1.series[0]);
                $scope.chartOptions2.seriesDefaults.type = "column";
                $scope.chartOptions2.categoryAxis.visible = true;

                 $scope.chartOptions2.series[0].data = calculData ;
                $scope.chartOptions2.series[1]= null
                $scope.chartOptions2.title= "Guest check vs Guest survey %";



                $("#chart3").kendoChart(
                    $.extend(true, {}, $scope.chartOptions2)
                );



            }

            // field.chartOptions = chartOptions;


            $(document).ready(createChart);
            $(document).bind("kendo:skinChange", createChart);




        }

////////////////////////////////////////////////
        ///////////////////////////////////////////////





    }
]);
