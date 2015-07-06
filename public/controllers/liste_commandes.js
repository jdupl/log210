var controllers = angular.module('app.controllers.ListeCommandes', []);

controllers.controller('ListeCommandes', function($scope, $http, $routeParams, Auth) {

  getCommandes =  function() {
    $http.get('/api/profile/orders', {headers: {'Authorization' : 'Bearer ' + $scope.token}})
      .success(function(data) {
        $scope.orders = data;
      });
  }

  $scope.closeAlert = function(index) {
    $scope.alerts.splice(index, 1);
  };

  $scope.update = function(order) {
    var updatedOrder = {status: order.status};
    $http.put('/api/orders/' + order._id, updatedOrder, {headers: {'Authorization' : 'Bearer ' + $scope.token}})
      .success(function(data) {
        getCommandes();
      }).error(function(data, status) {
        getCommandes();
        $scope.alerts.push({msg: "Malheuresement, une erreur est survenue lors de la modification du status.", type: 'danger'});
      });
  }

  $scope.status = [
      {code : 1, name : 'Commandé'},
      {code : 2, name : 'En préparation'},
      {code : 3, name : 'Prêtes'}
    ];

  $scope.alerts = [];
  $scope.token = Auth.isLoggedIn();
  getCommandes();
});
