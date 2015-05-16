angular.module('app', [
  'ngRoute',
  'ngStorage',
  'ui.bootstrap',
  'app.controllers.index',
  'app.controllers.connexion',
  'app.controllers.navbar',
  'app.controllers.inscrire',
]).config(['$routeProvider', '$httpProvider', function($routeProvider) {
    $routeProvider.when('/', {templateUrl: 'partials/index.html', controller: 'index'});
    $routeProvider.when('/inscrire', {templateUrl: 'partials/inscrire.html', controller: 'inscrire'});
    $routeProvider.when('/connexion', {templateUrl: 'partials/connexion.html', controller: 'ConnexionCtrl'});
	$routeProvider.when('/gestion_compte', {templateUrl: 'partials/gestion_compte.html', controller: 'utuilisateurCtrl'});
    $routeProvider.otherwise({redirectTo: '/'});
  }]);
