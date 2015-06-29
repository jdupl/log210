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
    currentOrder.status = 0;

    // we put the selected address
    currentOrder.delivery_address = $scope.order.delivery_address;

    // we put the date
    currentOrder.delivery_date = $scope.order.delivery_date;

    // we save the order in the database
    $http.post('/api/orders', currentOrder, {headers: {'Authorization' : 'Bearer ' + $scope.token}})
      .success(function(data) {
        delete $scope.order;
        selectedOrder.setOrder(null);
        $scope.alerts.push({msg: "La commande à été enregistré avec succès.", type: 'success'});
      })
      .error(function(data, status) {
        $scope.alerts.push({msg: "Malheuresement, une erreur est survenue lors de l'ajout et la commande n'a pas pu être enregistré.", type: 'danger'});
      });

  };

});
