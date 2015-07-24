var controllers = angular.module('app.controllers.MenuRestaurant', []);

controllers.controller('MenuRestaurant', function($scope, $http, $routeParams, $window, Auth) {

  loadAddresses();
  $scope.delivery_time = new Date(); //Set default value to avoid null value

  // specific function call of the datepicker
  angular.element('#datetimepicker').datetimepicker();

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
    $scope.total = 0;

    // we put the chosen items from the form in the current order
    angular.forEach($scope.menus, function(menu, key) {
      angular.forEach(menu.plates, function(plate, key) {
        if (plate.quantity > 0) {
          $scope.currentOrder.items.push(plate);
          $scope.total += plate.quantity * plate.price;
        }
      });
    });
    $scope.showCommandForm = true;
  }

  function loadAddresses() {
    $http.get('/api/profile/addresses', {headers: {'Authorization' : 'Bearer ' + $scope.token}})
      .success(function(data) {
        $scope.addresses = data;

        $scope.secondaryAddresses = $scope.addresses[0];
        $scope.order.delivery_address = $scope.addresses[0];
      });
  }

  $scope.open = function($event) {
    $event.preventDefault();
    $event.stopPropagation();

    $scope.opened = true;
  };

  $scope.submitOrder = function() {
    // we initiate the status
    $scope.currentOrder.status = 0;

    // we put the selected address
    $scope.currentOrder.delivery_address = $scope.order.delivery_address;

    // we put the date
    var final_date = mergeDateAndTime($scope.delivery_date, $scope.delivery_time);
    $scope.currentOrder.delivery_date = final_date;

    // we save the order in the database
    $http.post('/api/orders', $scope.currentOrder, {headers: {'Authorization' : 'Bearer ' + $scope.token}})
      .success(function(data) {
        $scope.orderToPay = $scope.currentOrder;
        delete $scope.order;
        $scope.showCommandForm = false;
        $scope.alerts.push({msg: "La commande à été enregistré avec succès.", type: 'success'});
        $scope.alerts.push({msg: "Votre numéro de confirmation est: " + data.confirmation_number, type: 'success'});
      })
      .error(function(data, status) {
        $scope.alerts.push({msg: "Malheuresement, une erreur est survenue lors de l'ajout et la commande n'a pas pu être enregistré.", type: 'danger'});
      });
  };

  $scope.createPayment = function (order) {
    console.log($scope.orderToPay);
    $http.post('/api/payment/', $scope.orderToPay, {headers: {'Authorization' : 'Bearer ' + $scope.token}})
      .success(function(data) {
        $window.location.href = data.redirect;
      });
  }

  function mergeDateAndTime(date, time) {
    console.log(time);
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), time.getHours(), time.getMinutes(), time.getSeconds());
  }

  $scope.alerts = [];
  $scope.token = Auth.isLoggedIn();
  if($scope.token) {
    loadAddresses();
    $scope.selectedRestaurantId = $routeParams.restaurantId;
    getRestaurant($scope.selectedRestaurantId);
  } else {
    window.location.href = "#/connexion";
  }
});
