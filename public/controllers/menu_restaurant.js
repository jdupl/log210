var controllers = angular.module('app.controllers.MenuRestaurant', []);

controllers.controller('MenuRestaurant', function($scope, $http, $routeParams, Auth) {

  function getRestaurant(id) {
    $http.get('/api/restaurants/' + id + '/menus', {headers: {'Authorization' : 'Bearer ' + $scope.token}})
      .success(function(data) {
        $scope.menus = data;
      });
  }

  $scope.submitPlates = function () {
    $scope.currentOrder = {};
    $scope.currentOrder.items = [];
    $scope.currentOrder.restaurant = $scope.selectedRestaurantId;

    // we put the chosen items from the form in the current order
    angular.forEach($scope.menus, function(menu, key) {
      angular.forEach(menu.plates, function(plate, key) {
        if (plate.quantite > 0) {
          console.log(plate);
          $scope.currentOrder.items.push(plate);
        }
      });
    });
    $scope.showCommandForm = true;
  }

  $scope.submitOrder = function() {
    // we initiate the status
    $scope.currentOrder.status = 0;

    // we put the selected address
    $scope.currentOrder.delivery_address = $scope.order.delivery_address;

    // we put the date
    $scope.currentOrder.delivery_date = $scope.order.delivery_date;

    // we save the order in the database
    $http.post('/api/orders', $scope.currentOrder, {headers: {'Authorization' : 'Bearer ' + $scope.token}})
      .success(function(data) {
        delete $scope.order;
        $scope.showCommandForm = false;
        $scope.alerts.push({msg: "La commande à été enregistré avec succès.", type: 'success'});
      })
      .error(function(data, status) {
        $scope.alerts.push({msg: "Malheuresement, une erreur est survenue lors de l'ajout et la commande n'a pas pu être enregistré.", type: 'danger'});
      });
  };

  $scope.alerts = [];
  $scope.token = Auth.isLoggedIn();
  $scope.selectedRestaurantId = $routeParams.restaurantId;
  getRestaurant($scope.selectedRestaurantId);
});
