'use strict';

angular.module('surveys').directive('formDirective', function () {
    return {
        controller: 'SurveysController'/*function($scope){
            $scope.submit = function(){
                alert('Form submitted..');
                $scope.form.submitted = true;
            }

            $scope.cancel = function(){
                alert('Form canceled..');
            }
        }*/,
        templateUrl: './surveys/views/directive-templates/form/form.html',
        restrict: 'E',
        scope: {
            form:'='
        }
    };
  });
