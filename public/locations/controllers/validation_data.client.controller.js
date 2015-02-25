// Invoke 'strict' JavaScript mode
'use strict';

// Create the 'validations' controller
angular.module('locations').controller("validationDataController", ['$scope', '$routeParams', 'Validations', 'Notifications', 'Dialogs',
  function ($scope, $routeParams, Validations, Notifications, Dialogs) {

//Expose the Dialog service
  $scope.dialog = {
    message: ""
  }

  $scope.showDialog = function(title, message, item) {
    Dialogs.showDialog(title, message).then(
      function() {
        //alert('Yes clicked');
        $scope.deleteDataItem(item);
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
      var found = false;

       angular.forEach($scope.location.validations, function(value,index){
              if(found)
                return found;

              if(value._id == $routeParams.validationId)
              {
                value.data.some(function (entry) {
                  if(entry.name.toUpperCase() == itemName.toUpperCase()){
                    found = true;
                    return;
                  }
                });
              }
          });

          return found;
    };

    var isNameDuplicated2Edit = function (itemName) {
      var count = 0;
      angular.forEach($scope.location.validations, function(value,index){
          if(count > 1) return true;
          if(value._id == $routeParams.validationId)
          {
            value.data.some(function (entry) {
                entry.name.toUpperCase() == itemName.toUpperCase() ? count++ : count;
            });
          }
        });
      return count == 1 ? false : true;
    };

    var isDirty = function(item) {
        return item.name != item.serverName;
    }

    // PUBLIC PROPERTIES

    // all the items
    $scope.location = [];
    $scope.validationData = [];

    // the item being added
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
        $scope.newDataItem.name = '';
        $scope.newDataItem.value = '';
        $scope.newDataItem.status = 'inactive';
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
            $scope.location.validations.forEach(function (i) {
                // item is not the item being edited now and it is in edit mode
                if (item._id != i._id && i.editMode) {
                    // Restore name
                    i.name = i.serverName;
                    i.editMode = false;
                }
            });
        }
    };

    // Creates the 'newDataItem' on the server
    $scope.createItem = function () {

      // Check if the item is already on the list
      var duplicated = isNameDuplicated($scope.newDataItem.name);

      if (!duplicated) {

          angular.forEach($scope.location.validations, function(value,index){
              if(value._id == $routeParams.validationId)
              {

                value.data.push($scope.newDataItem);

                $scope.validationRequest = {
                  "validations": $scope.location.validations,
                  "request_type": "update_validation_table"
                };

                Validations.update({locationId: $routeParams.locationId}, $scope.validationRequest, function (success) {
                    $scope.toggleAddMode();
                    requestSuccess();

                    $scope.findOneValidation();
                }, requestError);

              }
          });

      } else {
          Notifications.error("The validation data already exists.");
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

            angular.forEach($scope.location.validations, function(value,index){
                if(value._id == $routeParams.validationId)
                {
                        for(var v in value.data)
                        {
                            if(value.data[v]._id == item._id) {
                              value.data[v].name = item.name;
                              value.data[v].value = item.value;
                              value.data[v].status == item.status ? 'active' : 'inactive';
                            }
                        }

                        $scope.validationRequest = {
                          "validations": $scope.location.validations,
                          "request_type": "update_validation_table"
                        };

                        Validations.update({locationId: $routeParams.locationId}, $scope.validationRequest, function (success) {
                            $scope.toggleAddMode();
                            requestSuccess();
                        }, requestError);
                    }});

              } else {
                Notifications.error("The validation data already exists.");
              }

              $scope.findOneValidation();

          }
        }

    // Deletes an item
    $scope.deleteItem = function (item) {

      angular.forEach($scope.location.validations, function(value,index){
          if(value._id == $routeParams.validationId)
          {
            // Remove from scope
            var index_data = value.data.indexOf(item);
            value.data.splice(index_data, 1);
          }
      });

      $scope.validationRequest = {
        "validations": $scope.location.validations,
        "request_type": "update_validation_table"
      };


      Validations.update({locationId: $routeParams.locationId}, $scope.validationRequest, function (success) {
          requestSuccess();
      }, requestError);

    }

    $scope.findOneValidation = function() {
      $scope.location = Validations.get({locationId: $routeParams.locationId},function (success) {
          $scope.loading = false;
          angular.forEach($scope.location.validations, function(value,index){
                    if(value._id == $routeParams.validationId)
                    {
                      $scope.validationData = value.data;
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
    //$scope.findOneValidation();
}

]);
