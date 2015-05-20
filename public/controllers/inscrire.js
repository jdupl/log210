var controllers = angular.module('app.controllers.Inscrire', ['ui.date']);

controllers.controller('Inscrire', function($scope, $http) {

  $scope.inscrire = function() {
    var data = $scope.user;
    $scope.submitted = true;

    $http.post('/api/users', data)
      .success(function(data) {
        // TODO message succès
      })
      .error(function(data, status) {
        // TODO message erreur
      });
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
