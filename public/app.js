angular.module('app', [
  'ngRoute',
  'ui.bootstrap',
  'app.controllers.index',
  'app.controllers.navbar',
  'app.controllers.inscrire',
]).config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {templateUrl: 'partials/index.html', controller: 'index'});
    $routeProvider.when('/', {templateUrl: 'partials/inscrire.html', controller: 'inscrire'});
    $routeProvider.otherwise({redirectTo: '/'});
  }]);
