var controllers = angular.module('app.controllers.ModifierCompte', []);

controllers.controller('ModifierCompte', function($scope, $http) {

  $http.defaults.headers.put["Authorization"] = "Bearer " + $scope.token;

  $scope.saveUser = function(valid) {
    if (valid) {
      var data = $scope.user;

      $http.put('/api/users', data)
        .success(function(data) {
          $scope.sent = true;
          $scope.succes = true;
        })
        .error(function(data, status) {
          $scope.sent = true;
          $scope.errors = "Malheuresement, une erreur est survenue lors de l'enregistrement de l'utilisateur."
        });
    }
  };
});

controllers.directive('passwordCheck', [function () {
  return {
    restrict: 'A',
    scope: true,
    require: 'ngModel',
    link: function (scope, elem , attributes,control) {
      var checker = function () {
        var password1 = scope.$eval(attributes.ngModel);
        var password2 = scope.$eval(attributes.passwordCheck);

        return password1 == password2;
      };
      scope.$watch(checker, function (n) {
        control.$setValidity("unique", n);
      });
    }
  };
}]);
