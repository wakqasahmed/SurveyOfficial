// Invoke 'strict' JavaScript mode
'use strict';

// Create the 'validations' controller
angular.module('locations').controller("validationsController", ['$scope', '$routeParams', 'Validations', 'Notifications', 'Dialogs',
  function ($scope, $routeParams, Validations, Notifications, Dialogs) {

//Expose the Dialog service
  $scope.dialog = {
    message: ""
  }

  $scope.showDialog = function(title, message, item) {
    Dialogs.showDialog(title, message).then(
      function() {
        //alert('Yes clicked');
        $scope.deleteItem(item);
      },
      function() {
        //alert('No clicked');
      });
  }

    // PRIVATE FUNCTIONS
    var requestSuccess = function () {
        Notifications.success();
    }

    var requestError = function () {
        Notifications.error();
    }

    var isNameDuplicated = function (itemName) {
        return $scope.validationTables.validations.some(function (entry) {
            return entry.name.toUpperCase() == itemName.toUpperCase();
        });
    };

    var isNameDuplicated2Edit = function (itemName) {
        var count = 0;
        $scope.validationTables.validations.some(function (entry) {
            entry.name.toUpperCase() == itemName.toUpperCase() ? count++ : count;
        });
        return count == 1 ? false : true;
    };

    var isDirty = function(item) {
        return item.name != item.serverName;
    }

    // PUBLIC PROPERTIES

    // all the items
    $scope.validationTables = [];
    $scope.validationData = [];

    // the item being added
    $scope.newItem = { name: '' };
    $scope.newDataItem = { name: '', value: '', status: 'inactive' };

    // indicates if the view is being loaded
    $scope.loading = false;
    // indicates if the view is in add mode
    $scope.addMode = false;

    // PUBLIC FUNCTIONS

    // Toggle the grid between add and normal mode
    $scope.toggleAddMode = function () {
        $scope.addMode = !$scope.addMode;

        // Default new item name is empty
        $scope.newItem.name = '';
    };

    // Toggle an item between normal and edit mode
    $scope.toggleEditMode = function (item) {
        // Toggle
        item.editMode = !item.editMode;

        // if item is not in edit mode anymore
        if (!item.editMode) {
            // Restore name
            item.name = item.serverName;
        } else {
            // save server name to restore it if the user cancel edition
            item.serverName = item.name;

            // Set edit mode = false and restore the name for the rest of items in edit mode
            // (there should be only one)
            $scope.validationTables.validations.forEach(function (i) {
                // item is not the item being edited now and it is in edit mode
                if (item._id != i._id && i.editMode) {
                    // Restore name
                    i.name = i.serverName;
                    i.editMode = false;
                }
            });
        }
    };

    // Creates the 'newItem' on the server
    $scope.createItem = function () {
        // Check if the item is already on the list
        var duplicated = isNameDuplicated($scope.newItem.name);

        if (!duplicated) {

            $scope.validationTables.validations.push($scope.newItem);

            $scope.validationRequest = {
              "validations": $scope.validationTables.validations,
              "request_type": "update_validation_table"
            };

            Validations.update({locationId: $routeParams.locationId}, $scope.validationRequest, function (success) {
                $scope.toggleAddMode();
                requestSuccess();

                $scope.getAllItems();
            }, requestError);

        } else {
            Notifications.error("The validation table already exists.");
        }
    }

/*
    // Gets an item from the server using the id
    $scope.readItem = function (itemId) {
        Validations.get({ id: itemId }, requestSuccess, requestError);
    }
*/
    // Updates an item
    $scope.updateItem = function (item) {
        item.editMode = false;

        // Only update if there are changes
        if (isDirty(item)) {
          // Check if the item is in the list more than once (itself)
          var duplicated = isNameDuplicated2Edit(item.name);

          if(!duplicated) {

            for(var v in $scope.validationTables.validations)
            {
                if($scope.validationTables.validations[v]._id == item._id) {
                  $scope.validationTables.validations[v].name = item.name;
                }
            }

            $scope.validationRequest = {
              "validations": $scope.validationTables.validations,
              "request_type": "update_validation_table"
            };

            Validations.update({locationId: $routeParams.locationId}, $scope.validationRequest, function (success) {
                $scope.toggleAddMode();
                requestSuccess();
            }, requestError);

          } else {
            Notifications.error("The validation table already exists.");
          }

          $scope.getAllItems();

        }
    }

    // Deletes an item
    $scope.deleteItem = function (item) {

      // Remove from scope
      var index = $scope.validationTables.validations.indexOf(item);
      $scope.validationTables.validations.splice(index, 1);

      $scope.validationRequest = {
        "validations": $scope.validationTables.validations,
        "request_type": "update_validation_table"
      };

      Validations.update({locationId: $routeParams.locationId}, $scope.validationRequest, function (success) {
          requestSuccess();
      }, requestError);

    }

    // Get all items from the server
    $scope.getAllItems = function () {
        $scope.loading = true;

        $scope.validationTables = Validations.get({locationId: $routeParams.locationId},function (success) {
            $scope.loading = false;
        }, requestError);

    };

    $scope.findOneValidation = function() {
      $scope.validationTables = Validations.get({locationId: $routeParams.locationId},function (success) {
          $scope.loading = false;
          angular.forEach($scope.validationTables.validations, function(value,index){
                    if(value._id == $routeParams.validationId)
                    {
                      $scope.validationTable = value.data;
//                       alert(value.data);
                    }
                });
      }, requestError);
    };

    // In edit mode, if user press ENTER, update item
    $scope.updateOnEnter = function (item, args) {
        // if key is enter
        if (args.keyCode == 13) {
            $scope.updateItem(item);
            // remove focus
            args.target.blur();
        }
    };

    // In add mode, if user press ENTER, add item
    $scope.saveOnEnter = function (item, args) {
        // if key is enter
        if (args.keyCode == 13) {
            $scope.createItem();
            // remove focus
            args.target.blur();
        }
    };

    // LOADS ALL ITEMS
    $scope.getAllItems();
}

]);
