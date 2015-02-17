// Invoke 'strict' JavaScript mode
'use strict';

// Create the 'surveys' service
angular.module('surveys').factory('Surveys', ['$resource', function($resource) {
	// Use the '$resource' service to return an survey '$resource' object
    return $resource('api/surveys/:surveyId', {
        surveyId: '@_id'
    }, {
        update: {
            method: 'PUT'
        }
    });
}]);

// Create the 'forms' service
angular.module('surveys').factory('Forms', ['$http', function($http) {
  // Use the '$resource' service to return a form '$resource' object
  var formsJsonPath = './surveys/static-data/sample_forms.json';
  return {
      fields:[
          {
              name : 'textfield',
              value : 'Textfield'
          },
          {
              name : 'email',
              value : 'E-mail'
          },
          {
              name : 'password',
              value : 'Password'
          },
          {
              name : 'radio',
              value : 'Radio Buttons'
          },
          {
              name : 'dropdown',
              value : 'Dropdown List'
          },
          {
              name : 'date',
              value : 'Date'
          },
          {
              name : 'textarea',
              value : 'Text Area'
          },
          {
              name : 'checkbox',
              value : 'Checkbox'
          },
          {
              name : 'hidden',
              value : 'Hidden'
          }
      ],
      form:function (id) {
          // $http returns a promise, which has a then function, which also returns a promise
          return $http.get(formsJsonPath).then(function (response) {
              var requestedForm = {};
              angular.forEach(response.data, function (form) {
                  if (form.form_id == id) requestedForm = form;
              });
              return requestedForm;
          });
      },
      forms: function() {
          return $http.get(formsJsonPath).then(function (response) {
              return response.data;
          });
      }
  };
}]);
