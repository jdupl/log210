var controllers = angular.module('app.controllers.MenuRestaurant', []);

controllers.controller('MenuRestaurant', function($scope, $http, $routeParams, Auth, selectedOrder) {

  $scope.submitOrder = function (id) {
    // the function takes the current order and store it in the service selectedOrder for the next step of the command

    // we get the current order
    var currentOrder = selectedOrder.getOrder();

    // we get the restaurant chosen and put it in the current order
    $http.get('/api/restaurants/' + id, {headers: {'Authorization' : 'Bearer ' + $scope.token}})
      .success(function(data) {
        currentOrder.restaurant = data;
      });

    // we put the chosen items from the form in the current order
    angular.forEach($scope.plates, function(plate,key) {
      if(plate.quantite < 0){
        currentOrder.items.add(plate);
      }
    });

    // we store the new current order in the service
    selectedOrder.setOrder(currentOrder);

    // we change to the address page/part of the order
    document.location.href = "/#/order/";
    console.log(currentOrder);
  }

  $scope.getRestaurant =  function(id) {
    $http.get('/api/restaurants/' + id + '/menus', {headers: {'Authorization' : 'Bearer ' + $scope.token}})
      .success(function(data) {
        $scope.order = data;
      });
  }

  $scope.token = Auth.isLoggedIn();
  $scope.getRestaurant($routeParams.restaurantId);
});
