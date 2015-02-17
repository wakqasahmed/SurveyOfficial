// Invoke 'strict' JavaScript mode
'use strict';

// Create the 'surveys' controller
angular.module('surveys').controller('SurveysController', ['$scope', '$routeParams', '$location', 'Authentication', 'Surveys', 'Forms', 'Dialogs',
    function($scope, $routeParams, $location, Authentication, Surveys, Forms, Dialogs) {
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

// new form
$scope.form = {};
$scope.form.form_id = 1;
$scope.form.form_name = 'My Form';
$scope.form.form_fields = [];

// previewForm - for preview purposes, form will be copied into this
// otherwise, actual form might get manipulated in preview mode
$scope.previewForm = {};

// add new field drop-down:
$scope.addField = {};
$scope.addField.types = Forms.fields;
$scope.addField.new = $scope.addField.types[0].name;
$scope.addField.lastAddedID = 0;

// accordion settings
$scope.accordion = {}
$scope.accordion.oneAtATime = true;


//----------------Header Controller --------------//
$scope.$location = $location;

//----------------Create Controller --------------//
        // create new field button click
        $scope.addNewField = function(){

            // incr field_id counter
            $scope.addField.lastAddedID++;

            var newField = {
                "field_id" : $scope.addField.lastAddedID,
                "field_title" : "New field - " + ($scope.addField.lastAddedID),
                "field_type" : $scope.addField.new,
                "field_value" : "",
                "field_required" : true,
          "field_disabled" : false
            };

            // put newField into fields array
            $scope.form.form_fields.push(newField);
        }

        // deletes particular field on button click
        $scope.deleteField = function (field_id){
            for(var i = 0; i < $scope.form.form_fields.length; i++){
                if($scope.form.form_fields[i].field_id == field_id){
                    $scope.form.form_fields.splice(i, 1);
                    break;
                }
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
                "option_title" : "Option " + option_id,
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
        }





        // Create a new controller method for creating new surveys
        $scope.create = function() {
        	// Use the form fields to create a new survey $resource object
            var survey = new Surveys({
                title: this.title,
                content: this.content
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
            $scope.surveys = Surveys.query();
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
