angular.module('app', [
  'ngRoute',
  'ngStorage',
  'ui.bootstrap',
  'app.controllers.Index',
  'app.controllers.Connexion',
  'app.controllers.Navbar',
  'app.controllers.Inscrire',
  'app.controllers.ModifierCompte',
  'app.controllers.ModifierRestaurants',
  'app.controllers.ModifierRestaurateurs',
  'app.controllers.Logout',
]).config(['$routeProvider', '$httpProvider', function($routeProvider) {
    $routeProvider.when('/', {templateUrl: 'partials/index.html', controller: 'Index'});

    $routeProvider.when('/inscrire', {templateUrl: 'partials/inscrire.html', controller: 'Inscrire'});
    $routeProvider.when('/connexion', {templateUrl: 'partials/connexion.html', controller: 'Connexion'});
    $routeProvider.when('/logout', {templateUrl: 'partials/logout.html', controller: 'Logout'});

    $routeProvider.when('/modifier_compte', {templateUrl: 'partials/modifier_compte.html', controller: 'ModifierCompte'});
    $routeProvider.when('/modifier_restaurants', {templateUrl: 'partials/modifier_restaurants.html', controller: 'ModifierRestaurants'});
    $routeProvider.when('/modifier_restaurateurs', {templateUrl: 'partials/modifier_restaurateurs.html', controller: 'ModifierRestaurateurs'});

    $routeProvider.otherwise({redirectTo: '/'});
  }]).factory('Auth', function($localStorage, $rootScope, $http) {
      return {
        setToken : function(token) {
            $http.get('/api/profile', {headers: {'Authorization' : 'Bearer ' + token}})
              .success(function(data) {
                $localStorage.token = token;
                $localStorage.userType = data.type;
                $rootScope.$broadcast('login');
              })
        },
        isLoggedIn : function() {
          var token = $localStorage.token;
          return (token) ? token : false;
        },
        logout : function() {
          $localStorage.$reset();
          $rootScope.$broadcast('login');
        },
        getUserType : function() {
          return $localStorage.userType;
        }
      }
    });
