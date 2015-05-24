var controllers = angular.module('app.controllers.Connexion', []);

controllers.controller('Connexion', function ($http, Auth, $scope, $location, $rootScope) {
    $scope.connexion = function() {
      var data = {
        email: $scope.user.email,
        password: $scope.user.password
      }

      $http.post('/api/login', data)
        .success(function(data) {
          if (data.token) {
            Auth.setToken(data.token);
            $location.path('/');
          }
        })
        .error(function(data, status) {
          $rootScope.error = data.message;
        });
    };
  });
