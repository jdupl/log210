var controllers = angular.module('app.controllers.Order', ['ui.date']);

controllers.controller('Order', function($scope, $http, selectedOrder) {

  $scope.submitOrder = function() {
  // function triggered when the user confirm his command

    // we get the current order
    var currentOrder = selectedOrder.getOrder();

    // we put the current user as client for the current order
    $http.get('/api/profile', {headers: {'Authorization' : 'Bearer ' + $scope.token}})
      .success(function(data) {
        currentOrder.client = data;
      });

    // we initiate the status

    // we put the selected address

    // we put the date

    // we save the order in the database

  };

});
