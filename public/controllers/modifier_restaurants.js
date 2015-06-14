var controllers = angular.module('app.controllers.ModifierRestaurants', []);

controllers.controller('ModifierRestaurants', function($scope, $http) {
  $scope.alerts = [];
  loadRestaurateurs();
  refreshList();

  $scope.submitRestaurant = function() {
    $scope.alerts = [];
    var restaurant = $scope.restaurant;

    if(!restaurant.restaurateur) {
      $scope.alerts.push({msg: "Attention: Le restaurant n'a pas de restaurateur associé !", type: 'warning'});
    }

    $http.post('/api/restaurants', restaurant, {headers: {'Authorization' : 'Bearer ' + $scope.token}})
      .success(function(data) {
        delete $scope.restaurant;
        $scope.alerts.push({msg: "Le restaurant a été ajouté.", type: 'success'});
        refreshList();
      })
      .error(function(data, status) {
        $scope.alerts.push({msg: "Malheuresement, une erreur est survenue lors de l'inscription et le restaurant n'a pas pu être enregistré.", type: 'danger'});
      });
  };

  $scope.closeAlert = function(index) {
    $scope.alerts.splice(index, 1);
  };

  $scope.submitModifiedRestaurant = function(id) {
    $scope.alerts = [];
    var restaurant = $scope.restaurant;

    if(!restaurant.restaurateur) {
      $scope.alerts.push({msg: "Attention: Le restaurant n'a pas de restaurateur associé !", type: 'warning'});
    }

    $http.put('/api/restaurants/' + id, restaurant, {headers: {'Authorization' : 'Bearer ' + $scope.token}})
      .success(function(data) {
        //console.log(restaurateurs);
        console.log(restaurant);
        //console.log(restaurant);
        console.log(restaurant.restaurateur);
        delete $scope.restaurant;
        $scope.alerts.push({msg: "Le restaurant a été modifié.", type: 'success'});
        refreshList();
      })
      .error(function(data, status) {
        console.log(restaurant);
        console.log(restaurant.restaurateur);
        $scope.alerts.push({msg: "Malheuresement, une erreur est survenue lors de l'inscription et le restaurant n'a pas pu être modifié.", type: 'danger'});
      });
  };

  $scope.changeRestaurantInfo = function(id) {
    $scope.showModifyForm = true;

    $http.get('/api/restaurants/' + id, {headers: {'Authorization' : 'Bearer ' + $scope.token}})
      .success(function(data) {
        $scope.restaurant = data;
        //console.log(data);
        $scope.alerts.push({msg: "Vous avez commmencé la modification !", type: 'warning'});
      })
      .error(function(data, status) {
        $scope.alerts.push({msg: "Malheuresement, une erreur est survenue lors de la lecture des restaurants", type: 'danger'});
      });
  };

  $scope.deleteRestaurant = function(id) {
    $http.delete('/api/restaurants/' + id, {headers: {'Authorization' : 'Bearer ' + $scope.token}})
      .success(function(data) {
        $scope.alerts.push({msg: "Restaurant détruit!", type: 'warning'});
        refreshList();

      })
      .error(function(data, status) {
        $scope.alerts.push({msg: "Malheuresement, une erreur est survenue lors de la destruction du restaurant", type: 'danger'});
      });
  };

  function loadRestaurateurs() {
    $http.get('/api/users?type=restaurateur', {headers: {'Authorization' : 'Bearer ' + $scope.token}})
      .success(function(data) {
        $scope.restaurateurs = data;
      });
  }

  function refreshList() {
    $http.get('/api/restaurants', {headers: {'Authorization' : 'Bearer ' + $scope.token}})
      .success(function(data) {
        $scope.restaurants = data;
        if ($scope.restaurants.length === 0) {
          $scope.noRestaurants = true;
        }
      });
  }

});
