var controllers = angular.module('app.controllers.Inscrire', ['ui.date']);

controllers.controller('Inscrire', function($scope, $http) {

  $scope.inscrire = function(valid) {
    if (valid) {
      var data = $scope.user;

      $http.post('/api/users', data)
        .success(function(data) {
          $scope.sent = true;
          $scope.success = true;
        })
        .error(function(data, status) {
          $scope.sent = true;
          $scope.errors = "Malheuresement, une erreur est survenue lors de l'inscription et l'utilisateur n'a pas pu être enregistré."
        });
    }
  };
});
