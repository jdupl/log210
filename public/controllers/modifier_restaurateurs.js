var controllers = angular.module('app.controllers.ModifierRestaurateurs', []);

controllers.controller('ModifierRestaurateurs', function($scope, $http) {

  $scope.alerts = [];

  $scope.submitRestaurateur = function() {
    $scope.alerts = [];
    var user = $scope.user;

    if (!user.restaurants) {
      $scope.alerts.push({msg: "Attention: Le restaurateur n'a pas de restaurant associé !", type: 'warning'});
    }

    $http.post('/api/users', user)
      .success(function(data) {
        delete $scope.user;
        $scope.alerts.push({msg: "Le restaurateur a été ajouté.", type: 'success'});
      })
      .error(function(data, status) {
        $scope.alerts.push({msg: "Malheuresement, une erreur est survenue lors de l'inscription et l'utilisateur n'a pas pu être enregistré.", type: 'danger'});
      });
  };

  $scope.closeAlert = function(index) {
    $scope.alerts.splice(index, 1);
  };
});
