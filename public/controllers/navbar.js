var controllers = angular.module('app.controllers.Navbar', ['ui.date']);

controllers.controller('Navbar', function($scope, $rootScope, Auth, $location) {

  var types = {
    ADMIN: 'admin',
    CLIENT: 'client',
    ANONYMOUS: 'anonymous',
    RESTAURATEUR: 'restaurateur',
    DELIVERER: 'deliverer'
  };

  $scope.isActive = function(url) {
    return $location.path() === url;
  };

  $scope.refresh = function() {
    $scope.url = "partials/navbar.html";

    $scope.loggedin = Auth.isLoggedIn();
    var userType = Auth.getUserType();

    var permsModifierRestaurants = [types.ADMIN, types.RESTAURATEUR];
    var permsModifierRestaurateurs = [types.ADMIN];
    var permsListeCommandes = [types.RESTAURATEUR];

    $scope.showModifierRestaurants = permsModifierRestaurants.indexOf(userType) !== -1;
    $scope.showModifierRestaurateurs = permsModifierRestaurateurs.indexOf(userType) !== -1;
    $scope.showListeCommandes = permsListeCommandes.indexOf(userType) !== -1;
    $scope.showModifierMenu = userType === types.RESTAURATEUR;
    $scope.showlivrerDesCommandes = userType === types.DELIVERER;

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
