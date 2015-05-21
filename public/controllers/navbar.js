var controllers = angular.module('app.controllers.Navbar', ['ui.date']);

controllers.controller('Navbar', function($scope, $location, $localStorage) {
  $scope.isActive = function(url) {
    return $location.path() === url;
  };

  $('.navbar-nav li a').click(function() {
    if ($('.navbar-collapse.collapse').hasClass('in')) {
      $('#navbar').collapse('hide');
    }
  });

  $scope.url = "partials/navbar.html";

  $scope.token = $localStorage.token;
  if ($scope.token) { // checks for blank string or undefined
    $scope.loggedin = true;
  }
});
