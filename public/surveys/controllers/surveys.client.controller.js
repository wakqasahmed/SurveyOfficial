// Invoke 'strict' JavaScript mode
'use strict';

// Create the 'surveys' controller
angular.module('surveys').controller('SurveysController', ['$scope', '$routeParams', '$location', '$http', 'Authentication', 'Surveys', 'Forms', 'Dialogs',
    function($scope, $routeParams, $location, $http, Authentication, Surveys, Forms, Dialogs) {
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
              $location.path('/#!/surveys/');
            },
            function() {
              //alert('No clicked');
            });
        }

// preview form mode
$scope.previewMode = false;

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
$scope.addField.new = $scope.addField.types[0].name;
$scope.addField.lastAddedID = 0;

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

//$scope.surveyTypes = ["Customer Feedback","Home Delivery"];

//$scope.surveyTypes = [ { _id: 'Customer Feedback' }, { _id: 'Home Delivery' } ];

$scope.addSurveyType = function(query) {
    var obj = {_id: query};
    $scope.surveyTypes.push(obj);
    return obj;
};

// Create a new controller method for retrieving a list of brands with status 'active'
$scope.findSurveyTypes = function() {
  $http({method: 'GET', url: '/api/surveys/types'}).
    success(function(data, status, headers, config) {
      // this callback will be called asynchronously
      // when the response is available
      $scope.surveyTypes = data;
    }).
    error(function(data, status, headers, config) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
    });
};

// Create a new controller method for retrieving a list of brands with status 'active'
$scope.findActiveLocations = function() {
  $http({method: 'GET', url: '/api/locations/active'}).
    success(function(data, status, headers, config) {
      // this callback will be called asynchronously
      // when the response is available
      $scope.activeLocations = data;
      $scope.addPrompt.types = $scope.activeLocations[0].validations;
      $scope.addPrompt.new = $scope.addPrompt.types[0]._id;
    }).
    error(function(data, status, headers, config) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
    });
};

/*
$scope.locations = [{
    "_id": "54ec7e3a447de82d3c2544b4",
    "createdOn": "2015-02-24T13:35:54.000Z",
    "createdBy": "54e790b79e95cf4f2445ae9f",
    "name": "Carluccio Marina Mall",
    "country": "RAK4",
    "state": "RAK4",
    "postalCode": "RAK4",
    "timezone": "Asia/Dubai",
    "phoneManager": "RAK4",
    "brand": "54ec3772cd4f1c8825ff9cfe",
    "coords": [
        5,
        3
    ],
    "modifiedOn": "2015-02-24T14:30:25.000Z",
    "__v": 90,
    "validations": [
        {
            "name": "StaffID",
            "_id": "54ed4e0cc10a2f9d58a6bcbf",
            "data": [
                {
                    "name": "Waqas1",
                    "value": "Waqas",
                    "status": "inactive",
                    "_id": "54ed4e0cc10a2f9d58a6bcc2"
                },
                {
                    "name": "Waqas2",
                    "value": "Waqas",
                    "status": "inactive",
                    "_id": "54ed4e0cc10a2f9d58a6bcc1"
                },
                {
                    "name": "Waqas3",
                    "value": "Waqas",
                    "status": "inactive",
                    "_id": "54ed4e0cc10a2f9d58a6bcc0"
                }
            ]
        },
        {
            "name": "DriverID",
            "_id": "54ed4e0cc10a2f9d58a6bcbd",
            "data": [
                {
                    "name": "Waqas4",
                    "value": "Waqas",
                    "status": "inactive",
                    "_id": "54ed4e0cc10a2f9d58a6bcbe"
                }
            ]
        }
    ],
    "contactPerson": [
        {
            "name": "RAK4",
            "email": "RAK4@RAK4.RAK4",
            "phoneOffice": "RAK4",
            "phoneCell": "RAK4",
            "_id": "54ec7e3a447de82d3c2544b5"
        }
    ],
    "status": "active"
},
{
    "_id": "54ec7e3a447de82d3c2544b5",
    "createdOn": "2015-02-24T13:35:54.000Z",
    "createdBy": "54e790b79e95cf4f2445ae9f",
    "name": "Zafran Mirdif City Center",
    "country": "RAK4",
    "state": "RAK4",
    "postalCode": "RAK4",
    "timezone": "Asia/Dubai",
    "phoneManager": "RAK4",
    "brand": "54ec3772cd4f1c8825ff9cfe",
    "coords": [
        5,
        3
    ],
    "modifiedOn": "2015-02-24T14:30:25.000Z",
    "__v": 90,
    "validations": [
        {
            "name": "StaffID",
            "_id": "54ed4e0cc10a2f9d58a6bcbf",
            "data": [
                {
                    "name": "Waqas1",
                    "value": "Waqas",
                    "status": "inactive",
                    "_id": "54ed4e0cc10a2f9d58a6bcc2"
                },
                {
                    "name": "Waqas2",
                    "value": "Waqas",
                    "status": "inactive",
                    "_id": "54ed4e0cc10a2f9d58a6bcc1"
                },
                {
                    "name": "Waqas3",
                    "value": "Waqas",
                    "status": "inactive",
                    "_id": "54ed4e0cc10a2f9d58a6bcc0"
                }
            ]
        },
        {
            "name": "DriverID",
            "_id": "54ed4e0cc10a2f9d58a6bcbd",
            "data": [
                {
                    "name": "Waqas4",
                    "value": "Waqas",
                    "status": "inactive",
                    "_id": "54ed4e0cc10a2f9d58a6bcbe"
                }
            ]
        }
    ],
    "contactPerson": [
        {
            "name": "RAK4",
            "email": "RAK4@RAK4.RAK4",
            "phoneOffice": "RAK4",
            "phoneCell": "RAK4",
            "_id": "54ec7e3a447de82d3c2544b5"
        }
    ],
    "status": "active"
}
];*/



//----------------Header Controller --------------//
$scope.$location = $location;

//----------------Create Controller --------------//
        // create new field button click
        $scope.addNewField = function(){

            // incr field_id counter
            $scope.addField.lastAddedID++;

            var newField = {
                "field_id" : $scope.addField.lastAddedID,
                "field_titleEN" : "New Question - " + ($scope.addField.lastAddedID),
                "field_titleAR" : $scope.addField.lastAddedID + " سؤال جديد",
                "field_type" : $scope.addField.new,
                "field_value" : "",
                "field_required" : true,
                "field_disabled" : false,
                "field_order": $scope.addField.lastAddedID
            };

            // put newField into fields array
            $scope.form.form_fields.push(newField);
        }

        // create new prompt field button click
        $scope.addNewPrompt = function(){

            for(var p in $scope.addPrompt.types)
            {
              if($scope.addPrompt.types[p]._id == $scope.addPrompt.new)
              {
                $scope.added_promptName = $scope.addPrompt.types[p].name;
                $scope.added_promptID = $scope.addPrompt.types[p]._id;
              }
            }

            // incr field_id counter
            $scope.addPrompt.lastAddedID++;
            var newPromptField = {
              /*
              title: String,
              type: {type: String, default: 'dropdown'},
              order: Number,
              required: {type: Boolean, default: true},
              disabled: {type: Boolean},
              validation: { type: Schema.ObjectId, ref: 'Location' }
              */
                "field_id" : $scope.addPrompt.lastAddedID,
                "field_title" : $scope.added_promptName,
                "field_type" : 'dropdown',
                "field_value" : "",
                "field_required" : true,
                "field_disabled" : false,
                "field_order": $scope.addPrompt.lastAddedID,
                "field_validation": $scope.added_promptName
            };

            // put newPromptField into fields array
            $scope.form.prompt_fields.push(newPromptField);
        }

        // deletes particular field on button click
        $scope.deleteField = function (field_id){
            for(var i = 0; i < $scope.form.form_fields.length; i++){
                if($scope.form.form_fields[i].field_id == field_id){
                    $scope.form.form_fields.splice(i, 1);
                    break;
                }
            }

            if($scope.form.form_fields.length > 0){
              $scope.setOrder($scope.form.form_fields);
            }
        }

        // deletes particular prompt field on button click
        $scope.deletePromptField = function (field_id){
            for(var i = 0; i < $scope.form.prompt_fields.length; i++){
                if($scope.form.prompt_fields[i].field_id == field_id){
                    $scope.form.prompt_fields.splice(i, 1);
                    break;
                }
            }

            if($scope.form.prompt_fields.length > 0){
              $scope.setOrder($scope.form.prompt_fields);
            }
        }

        // add new option to the field
        $scope.addOption = function (field){
            if(!field.field_options)
                field.field_options = new Array();

            var lastOptionID = 0;

            if(field.field_options[field.field_options.length-1])
                lastOptionID = field.field_options[field.field_options.length-1].option_id;

            // new option's id
            var option_id = lastOptionID + 1;

            var newOption = {
                "option_id" : option_id,
                "option_titleEN" : "Option " + option_id,
                "option_titleAR" : option_id + " اختيار",
                "option_value" : option_id
            };

            // put new option into field_options array
            field.field_options.push(newOption);
        }

        // delete particular option
        $scope.deleteOption = function (field, option){
            for(var i = 0; i < field.field_options.length; i++){
                if(field.field_options[i].option_id == option.option_id){
                    field.field_options.splice(i, 1);
                    break;
                }
            }
        }


        // preview form
        $scope.previewOn = function(){
            if($scope.form.form_fields == null || $scope.form.form_fields.length == 0) {
                var title = 'Error';
                var msg = 'No fields added yet, please add fields to the form before preview.';
                var btns = [{result:'ok', label: 'OK', cssClass: 'btn-primary'}];

                //$routeParams.messageBox(title, msg, btns).open();
            }
            else {
                $scope.previewMode = !$scope.previewMode;
                $scope.form.submitted = false;
                angular.copy($scope.form, $scope.previewForm);
            }
        }

        // hide preview form, go back to create mode
        $scope.previewOff = function(){
            $scope.previewMode = !$scope.previewMode;
            $scope.form.submitted = false;
        }

        // decides whether field options block will be shown (true for dropdown and radio fields)
        $scope.showAddOptions = function (field){
            if(field.field_type == "radio" || field.field_type == "dropdown")
                return true;
            else
                return false;
        }

        // deletes all the fields
        $scope.reset = function (){
            $scope.form.form_fields.splice(0, $scope.form.form_fields.length);
            $scope.addField.lastAddedID = 0;

            $scope.form.prompt_fields.splice(0, $scope.form.prompt_fields.length);
            $scope.addPromptField.lastAddedID = 0;

        }

        $scope.setOrder = function($partTo){
          var count = 1;

          for(var p in $partTo)
          {
            $partTo[p].field_order = count++;
          }
        }

        // Create a new controller method for creating new surveys
        $scope.create = function() {

          $scope.form.form_status = ($scope.form.form_status ? 'active' : 'inactive');
          $scope.prompt_fields = [];
          $scope.form_fields = [];
          $scope.form_locations = [];

          angular.forEach($scope.form.form_locations, function(location){
              $scope.form_locations.push(location._id);
              //$scope.form_locations.push(location);
          });

          angular.forEach($scope.form.prompt_fields, function(prompt_field){

              var field = {
                  'title': prompt_field.field_title,
                  'type': prompt_field.field_type,
                  'order': prompt_field.field_order,
                  'required': prompt_field.field_required,
                  'disabled': prompt_field.field_disabled,
                  'validation': prompt_field.field_validation
              };

              $scope.prompt_fields.push(field);
          });

          angular.forEach($scope.form.form_fields, function(form_field){

              var choices = [];
              if(form_field.field_options){
                angular.forEach(form_field.field_options, function(options){
                    var choice = {
                      'textEN': options.option_titleEN,
                      'textAR': options.option_titleAR,
                      'value': options.option_value,
                      'goto': options.option_goto,
                      'notify': options.option_notify,
                    };

                    choices.push(choice);
                });
              }

              var field = {
                  'titleEN': form_field.field_titleEN,
                  'titleAR': form_field.field_titleAR,
                  'type': form_field.field_type,
                  'order': form_field.field_order,
                  'required': form_field.field_required,
                  'disabled': form_field.field_disabled,
                  'choices': choices
              };

              $scope.form_fields.push(field);
          });

        	// Use the form fields to create a new survey $resource object
            var survey = new Surveys({
                name: this.form.form_name,
                startDate: this.form.form_start_date,
                endDate: this.form.form_end_date,
                status: this.form.form_status,
                locationIds: $scope.form_locations, //locations where this survey is used ex. carluccios locationId: 01
                type: this.form.form_type,
                questions: [{
                  prompt: $scope.prompt_fields,
                  survey: $scope.form_fields
                }]
            });

            // Use the survey '$save' method to send an appropriate POST request
            survey.$save(function(response) {
            	// If an survey was created successfully, redirect the user to the survey's page
                $location.path('surveys/' + response._id);
            }, function(errorResponse) {
            	// Otherwise, present the user with the error message
                $scope.error = errorResponse.data.message;
            });
        };

        // Create a new controller method for retrieving a list of surveys
        $scope.find = function() {
        	// Use the survey 'query' method to send an appropriate GET request
          //  $scope.surveys = Surveys.query();

          $scope.surveys = {
              dataSource: {
                  type: "json",
                  transport: {
                      read: "/api/surveys"
                  },
                  pageSize: 5,
                  serverPaging: true,
                  serverSorting: true
              },
              sortable: true,
              pageable: true,
              columns: [{
                  //field: "name",
                  title: "Survey Name",
                  width: "120px",
                  template: "<a href='\\#\\!/surveys/{{dataItem._id}}'>{{dataItem.name}}</a>"
                  },{
                  field: "status",
                  title: "Status",
                  width: "120px"
//                  template: "{{'PO Box ' + dataItem.postalCode + ' ' + dataItem.state + ' ' + dataItem.country}}"
                  },{
                  field: "startDate",
                  title: "Start Date",
                  width: "120px"
                  },{
                  field: "endDate",
                  title: "End Date",
                  width: "120px"
                  },{
                  field: "type",
                  title: "Type",
                  width: "120px"
//                  template: "{{'PO Box ' + dataItem.postalCode + ' ' + dataItem.state + ' ' + dataItem.country}}"
                  },{
//                  field: "locationIds[0].locationId.name",
                  title: "Locations",
                  width: "120px",
                  template: "<div ng-repeat='loc in dataItem.locationIds'><div ng-repeat='(key, value) in loc'>{{value.name}}</div></div>"
        }]
          };

        };

        // Create a new controller method for retrieving a single survey
        $scope.findOne = function() {
          /*
        	// Use the survey 'get' method to send an appropriate GET request
            $scope.survey = Surveys.get({
                surveyId: $routeParams.surveyId
            });

            */

            //----------------View Controller --------------//

              $scope.form = {};
              // read form with given id
              Forms.form($routeParams.surveyId).then(function(form) {
                $scope.form = form;
                console.log($scope.form);
              });
        };

        // Create a new controller method for updating a single survey
        $scope.update = function() {
        	// Use the survey '$update' method to send an appropriate PUT request
            $scope.survey.$update(function() {
            	// If an survey was updated successfully, redirect the user to the survey's page
                $location.path('surveys/' + $scope.survey._id);
            }, function(errorResponse) {
            	// Otherwise, present the user with the error message
                $scope.error = errorResponse.data.message;
            });
        };

        // Create a new controller method for deleting a single survey
        $scope.delete = function(survey) {
        	// If an survey was sent to the method, delete it
            if (survey) {
            	// Use the survey '$remove' method to delete the survey
                survey.$remove(function() {
                	// Remove the survey from the surveys list
                    for (var i in $scope.surveys) {
                        if ($scope.surveys[i] === survey) {
                            $scope.surveys.splice(i, 1);
                        }
                    }
                });
            } else {
            	// Otherwise, use the survey '$remove' method to delete the survey
                $scope.survey.$remove(function() {
                    $location.path('surveys');
                });
            }
        };




    }
]);
