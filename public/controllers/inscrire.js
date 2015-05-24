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
