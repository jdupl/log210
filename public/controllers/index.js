var controllers = angular.module('app.controllers.Index', []);

controllers.controller('Index', function($scope, $http, Auth) {
  $scope.hello = "Bienvenue sur restaurant log210";
  refreshList();

  $scope.afficherRestaurant = function(id) {
    document.location.href = "/#/menu_restaurant/" + id;
  };

  function refreshList() {
    $http.get('/api/restaurants')
      .success(function(data) {
        $scope.restaurants = data;
        if ($scope.restaurants.length === 0) {
          $scope.noRestaurants = true;
        }
      });
  }
});
