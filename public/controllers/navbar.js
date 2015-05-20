var controllers = angular.module('app.controllers.Navbar', ['ui.date']);

controllers.controller('Navbar', function($scope, $location) {
  $scope.isActive = function(url) {
    return $location.path() === url;
  };
  $('.navbar-nav li a').click(function() {
    if ($('.navbar-collapse.collapse').hasClass('in')) {
      $('#navbar').collapse('hide');
    }
  });
});
