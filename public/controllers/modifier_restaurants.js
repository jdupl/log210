var controllers = angular.module('app.controllers.ModifierRestaurants', []);

controllers.controller('ModifierRestaurants', function($scope, $http) {
  $scope.alerts = [];
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
  
  $scope.changeRestaurantInfo = function() {
	$scope.showModifyForm = true;
	
	$http.get('/api/restaurants/:id', {headers: {'Authorization' : 'Bearer ' + $scope.token}})
      .success(function(data) {
		$scope.restaurant = data;
		console.log(JSON.stringify(data));
      });
	
    $scope.alerts.push({msg: "Vous avez commmencé la modification !", type: 'warning'});
  };
  
  $scope.deleteRestaurant = function() {
	
	$http.delete('/api/restaurants/:id', {headers: {'Authorization' : 'Bearer ' + $scope.token}})
      .success(function(data) {
		$scope.alerts.push({msg: "Restaurant détruit!", type: 'warning'});
      });
	  refreshList();
  };
  
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
