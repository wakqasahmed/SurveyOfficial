// Invoke 'strict' JavaScript mode
'use strict';

// Create the 'dashboard' controller
angular.module('dashboard').controller('DashboardController', ['$scope', 'Authentication',
	function($scope, Authentication) {
		// Expose the authentication service
		$scope.authentication = Authentication;

		if(!$scope.authentication.user)
			window.location.href = '/signin';

		$scope.placeholder = function(element) {
      return element.clone().addClass("placeholder");
    };

    $scope.hint = function(element) {
      return element.clone().addClass("hint")
        .height(element.height())
        .width(element.width());
    };

    $scope.country = new kendo.data.DataSource({
      data: [
        { country: "Carluccio", value: 76430000 },
        { country: "Zafran", value: 53100000 },
        { country: "Max", value: 12466000 },
        { country: "Mango", value: 9600000 },
        { country: "Max", value: 9400000 },
        { country: "Wild", value: 7700000 },
        { country: "Balance", value: 7350000 }
      ]
    });

    $scope.pct = new kendo.data.DataSource({
      data: [
        { type: "Customer Feedback", value: 66.5 },
        { type: "Audit", value: 10.4 },
        { type: "Other", value: 23.1 }
      ]
    });

    // when an item is dropped in either the side or
    // main containers, resize any Kendo UI widgets
    // inside
    $scope.dropped = function(e) {
      if (e.action === 'receive') {
        kendo.resize(e.item);
      }
    };

    $(window).resize(function () {
      kendo.resize('.widget');
    });

	}
]);
