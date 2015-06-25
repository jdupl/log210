var controllers = angular.module('app.controllers.MenuRestaurant', []);

controllers.controller('MenuRestaurant', function($scope, $http, $routeParams, Auth) {

  $scope.submitOrder = function () {
  var elements = document.getElementById("order").elements;
  var menu = {};
  for (var i = 0, element; element = elements[i++];) {
      if (element.type === "number" && element.value !== "" && element.value > 0) {
        var res = element.id.split(":");
        var plate = '{ "' + $scope.menus[res[0]].plates[res[1]]._id + '" : ' + element.value + ' }';
        if(!menu[$scope.menus[res[0]]._id]) {
          menu[$scope.menus[res[0]]._id] = [];
        }
        menu[$scope.menus[res[0]]._id].push(plate);
      }
    }
  var data = {};
  data["restaurant"] = $routeParams.restaurantId;
  data["commande"] = menu;
  JSON.stringify(data);
  }

  $scope.getRestaurant =  function(id) {
    $http.get('/api/restaurants/' + id + '/menus', {headers: {'Authorization' : 'Bearer ' + $scope.token}})
      .success(function(data) {
        $scope.menus = data;
      });
  }
  
  $scope.token = Auth.isLoggedIn();
  $scope.getRestaurant($routeParams.restaurantId);
});
