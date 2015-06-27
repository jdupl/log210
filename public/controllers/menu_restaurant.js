var controllers = angular.module('app.controllers.MenuRestaurant', []);

controllers.controller('MenuRestaurant', function($scope, $http, $routeParams, Auth) {

  $scope.submitOrder = function () {
    // Goto order confirmation
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
