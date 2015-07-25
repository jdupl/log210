var controllers = angular.module('app.controllers.Livrer', []);

controllers.controller('Livrer', function($scope, $http, Auth) {
  var map, directionsService, directionsDisplay;
  $scope.showMap = false;
  $scope.showOrders = false;
  $scope.alerts = [];

  updateOrders();
  var mapOptions = {
    zoom: 8,
    center: new google.maps.LatLng(45.5, -73.6),
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  $scope.closeAlert = function(index) {
    $scope.alerts.splice(index, 1);
  };

  $scope.setLocation = function() {
    $scope.location = $scope.livreur.location;
    $scope.showOrders = true;
  };

  $scope.setLivraison = function(order) {
    order.status = 4;
    $http.put('/api/orders/' + order._id, order)
      .success(function(data) {
        $scope.alerts.push({msg: "Dépêchez-vous ! La commande est en cours de livraison.", type: 'success'});
        updateOrders();
      }).error(function(data, status, headers) {
        $scope.alerts.push({msg: data.message, type: 'danger'});
        updateOrders();
      });
  };

  $scope.viewPath = function (order) {
    $scope.update($scope.location, order.delivery_address);
  };

  function updateOrders() {
    $http.get('/api/orders?status=3', {headers: {'Authorization' : 'Bearer ' + $scope.token}})
      .success(function(data) {
        $scope.orders = data;
      });
  }

  function init() {
    map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
    directionsService = new google.maps.DirectionsService();
    directionsDisplay = new google.maps.DirectionsRenderer();
    directionsDisplay.setMap(map);
  }

  $scope.update = function (start, end) {
    if (!map) {
      init();
    }

    var request = {
      origin: start,
      destination: end,
      travelMode: google.maps.TravelMode.DRIVING
    };

    directionsService.route(request, function(response, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        directionsDisplay.setDirections(response);
        $scope.showMap = true;
      }
    });
  }
});
