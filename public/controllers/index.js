var controllers = angular.module('app.controllers.Index', []);

controllers.controller('Index', function($scope, Auth) {
  $scope.hello = "Bienvenue sur restaurant log210";
});
