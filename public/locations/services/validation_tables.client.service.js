angular.module('locations').factory('Notifications', function () {
    toastr.options = {
        "showDuration": "100",
        "hideDuration": "100",
        "timeOut": "3000",
        "extendedTimeOut": "5000",
    }

    return {
        success: function (text) {
            if (text === undefined) {
                text = '';
            }
            toastr.success("Success. " + text);
        },
        error: function (text) {
            if (text === undefined) {
                text = '';
            }
            toastr.error("Error. " + text);
        }
    };
});

angular.module('locations').factory("Validations", function ($resource) {

    return $resource('/api/locations/:locationId', //return $resource('/api/locations/:id',
    {
        // default URL params
        // @ Indicates that the value should be obtained from a data property
        //id: '@Id'
        locationId: '@_id'
    },
    {
        // add update to actions (is not defined by default)
        'update': { method: 'PUT' }
    });
});
