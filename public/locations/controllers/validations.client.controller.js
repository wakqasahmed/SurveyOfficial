angular.module('locations').controller("knownItemsController", function ($scope, $routeParams, knownItemsFactory, notificationFactory) {

    // PRIVATE FUNCTIONS
    var requestSuccess = function () {
        notificationFactory.success();
    }

    var requestError = function () {
        notificationFactory.error();
    }

    var isNameDuplicated = function (itemName) {
        return $scope.knownItems.some(function (entry) {
            return entry.name.toUpperCase() == itemName.toUpperCase();
        });
    };

    var isDirty = function(item) {
        return item.name != item.serverName;
    }

    // PUBLIC PROPERTIES

    // all the items
    $scope.knownItems = [];
    // the item being added
    $scope.newItem = { name: '' };
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
            $scope.knownItems.forEach(function (i) {
                // item is not the item being edited now and it is in edit mode
                if (item.id != i.id && i.editMode) {
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
        var duplicated = false; //isNameDuplicated($scope.newItem.name);

        if (!duplicated) {
            knownItemsFactory.save($scope.newItem,
            // success response
            function (createdItem) {
                // Add at the first position
                $scope.knownItems.unshift(createdItem);
                $scope.toggleAddMode();

                requestSuccess();
            },
            requestError);
        } else {
            notificationFactory.error("The item already exists.");
        }
    }

    // Gets an item from the server using the id
    $scope.readItem = function (itemId) {
        knownItemsFactory.get({ id: itemId }, requestSuccess, requestError);
    }

    // Updates an item
    $scope.updateItem = function (item) {
        item.editMode = false;

        // Only update if there are changes
        if (isDirty(item)) {
            knownItemsFactory.update({ id: item.id }, item, function (success) {
                requestSuccess();
            }, requestError);
        }
    }

    // Deletes an item
    $scope.deleteItem = function (item) {
        knownItemsFactory.delete({ id: item.id }, item, function (success) {
            requestSuccess();
            // Remove from scope
            var index = $scope.knownItems.indexOf(item);
            $scope.knownItems.splice(index, 1);
        }, requestError);
    }

    // Get all items from the server
    $scope.getAllItems = function () {
        $scope.loading = true;
        /*
        $scope.knownItems = knownItemsFactory.query(function (success) {
            $scope.loading = false;
        }, requestError);
        */

        $scope.knownItems = knownItemsFactory.get({locationId: $routeParams.locationId},function (success) {
            $scope.loading = false;
        }, requestError);

    };

    $scope.findOneValidation = function() {
      $scope.knownItems = knownItemsFactory.get({locationId: $routeParams.locationId},function (success) {
          $scope.loading = false;
          angular.forEach($scope.knownItems.validations, function(value,index){
                    if(value._id == $routeParams.validationId)
                    {
                      $scope.validationDoc = value.data;
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
});
