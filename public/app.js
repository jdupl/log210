angular.module('app', [
  'ngRoute',
  'ngStorage',
  'ui.bootstrap',
  'app.controllers.Index',
  'app.controllers.Connexion',
  'app.controllers.Navbar',
  'app.controllers.Inscrire',
  'app.controllers.ModifierCompte',
]).config(['$routeProvider', '$httpProvider', function($routeProvider) {
    $routeProvider.when('/', {templateUrl: 'partials/index.html', controller: 'Index'});
    $routeProvider.when('/inscrire', {templateUrl: 'partials/inscrire.html', controller: 'Inscrire'});
    $routeProvider.when('/connexion', {templateUrl: 'partials/connexion.html', controller: 'Connexion'});
    $routeProvider.when('/modifier_compte', {templateUrl: 'partials/modifier_compte.html', controller: 'ModifierCompte'});
    $routeProvider.otherwise({redirectTo: '/'});
  }]);
