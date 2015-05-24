var controllers = angular.module('app.controllers.Navbar', ['ui.date']);

controllers.controller('Navbar', function($scope, $rootScope, Auth, $location) {
  $scope.isActive = function(url) {
    return $location.path() === url;
  };

  $scope.refresh = function() {
    $scope.loggedin = Auth.isLoggedIn();
    $scope.url = "partials/navbar.html";
    $rootScope.token = $scope.loggedin;
  }

  $scope.$on("login", function() {
    $scope.refresh();
  });

  $('.navbar-nav li a').click(function() {
    if ($('.navbar-collapse.collapse').hasClass('in')) {
      $('#navbar').collapse('hide');
    }
  });

  $scope.refresh();
});
