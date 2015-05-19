var controllers = angular.module('app.controllers.inscrire', ['ui.date']);

controllers.controller('inscrire', function($scope) {

  $scope.submitForm = function() {
    // formulaire is submitted at least once
    $scope.submitted = true;

    if ($scope.inscrireForm.$valid) {
      alert('form submitted');
    }
  }
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
