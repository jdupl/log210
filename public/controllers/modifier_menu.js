var controllers = angular.module('app.controllers.ModifierMenu', []);

controllers.controller('ModifierMenu', function($scope, $http, Auth) {

  $scope.token = Auth.isLoggedIn();
  $scope.showRestaurantList = true;
  $scope.alerts = [];

  function getCurrentUserId(cb) {
    $http.get('/api/profile', {headers: {'Authorization' : 'Bearer ' + $scope.token}})
      .success(function(data) {
        $scope.user = data;
        cb();
      });
  }

  function getRestaurantsCb() {
    $http.get('/api/users/' + $scope.user._id + '/restaurants/', {headers: {'Authorization' : 'Bearer ' + $scope.token}})
      .success(function(data) {
        $scope.restaurants = data;
      });
  }

  $scope.prepare = function (r) {
    $scope.restaurant = r;
    $scope.showRestaurantList = false;
    $scope.showAddMenu = true;

    $scope.menu = {};
    $scope.menu.restaurant = r._id;
    $scope.menu.plates = [];
  }

  $scope.addPlateToMenu = function () {
    $scope.showAddPlate = false;
    console.log($scope.menu);
    $scope.menu.plates.push($scope.plate);
    delete $scope.plate;
  }

  $scope.submitMenu = function () {
    $http.post('/api/menus', $scope.menu, {headers: {'Authorization' : 'Bearer ' + $scope.token}})
      .success(function(data) {
        $scope.alerts.push({msg: "Le menu a été ajouté.", type: 'success'});
        delete $scope.menu;
        delete $scope.restaurant;
        $scope.showRestaurantList = true;
        $scope.showAddMenu = false;
      }).error(function () {
        $scope.alerts.push({msg: "Malheuresement, une erreur est survenue lors de l'enregistrement du menu.", type: 'danger'});
      });
  }

  $scope.getRestaurants =  function() {
    // funny api
    getCurrentUserId(getRestaurantsCb);
  }

  $scope.closeAlert = function(index) {
    $scope.alerts.splice(index, 1);
  };

  $scope.getRestaurants();
});
