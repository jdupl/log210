var controllers = angular.module('app.controllers.ModifierRestaurateurs', []);

controllers.controller('ModifierRestaurateurs', function($scope, $http) {

  $scope.alerts = [];
  refreshList();

  $scope.submitRestaurateur = function() {
    $scope.alerts = [];
    var user = $scope.user;
    user.type = 'restaurateur';

    if (!user.restaurants) {
      $scope.alerts.push({msg: "Attention: Le restaurateur n'a pas de restaurant associé !", type: 'warning'});
    }

    $http.post('/api/users', user, {headers: {'Authorization' : 'Bearer ' + $scope.token}})
      .success(function(data) {
        delete $scope.user;
        $scope.alerts.push({msg: "Le restaurateur a été ajouté.", type: 'success'});
        refreshList();
      })
      .error(function(data, status) {
        $scope.alerts.push({msg: "Malheuresement, une erreur est survenue lors de l'inscription et l'utilisateur n'a pas pu être enregistré.", type: 'danger'});
      });
  };

  $scope.closeAlert = function(index) {
    $scope.alerts.splice(index, 1);
  };

  function refreshList() {
    $http.get('/api/users?type=restaurateur', {headers: {'Authorization' : 'Bearer ' + $scope.token}})
      .success(function(data) {
        $scope.restaurateurs = data;
        if ($scope.restaurateurs.length === 0) {
          $scope.noRestaurateurs = true;
        }
      });
  }

});
