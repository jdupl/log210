var controllers = angular.module('app.controllers.Logout', ['ngStorage']);
controllers.controller('Logout', function ($http, Auth, $scope, $route, $location) {
  Auth.logout();
});
