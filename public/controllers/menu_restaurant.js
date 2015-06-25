var controllers = angular.module('app.controllers.MenuRestaurant', []);

controllers.controller('MenuRestaurant', function($scope, $http, $routeParams, Auth) {

  $scope.submitOrder = function () {

  }

  $scope.getRestaurant =  function(id) {
    $http.get('/api/restaurants/' + id, {headers: {'Authorization' : 'Bearer ' + $scope.token}})
      .success(function(data) {
        $scope.restaurant = data;
        $scope.menu = $scope.restaurant.menu
      });
  }


  $scope.token = Auth.isLoggedIn();

  $scope.getRestaurant($routeParams.restaurantId);
});
