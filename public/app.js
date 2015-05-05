angular.module('app', [
  'ngRoute',
  'ui.bootstrap',
  'app.controllers.index',
  'app.controllers.navbar'
]).config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {templateUrl: 'partials/index.html', controller: 'index'});
    $routeProvider.otherwise({redirectTo: '/'});
  }]);
