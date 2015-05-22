angular.module('app.controllers.Connexion', [])
//Controller
.controller('Connexion', [
    '$http',
    '$scope',
    '$rootScope',
    '$localStorage',
    '$sessionStorage',
    function ($http, $scope, $rootScope, $localStorage, $sessionStorage) {
      $scope.connexion = function() {
        var data = {
          email: $scope.user.email,
          password: $scope.user.password
        }

        $http.post('/api/login', data)
          .success(function(data) {
            if (data.token) {
              $localStorage.token = data.token;
              $scope.token = $localStorage.token;
              window.location = "/";
            } else {
              $scope.token = '';
              $scope.logout();
            }
          })
          .error(function(data, status) {
            $rootScope.error = data.message;
            $scope.token = '';
          });
      };

      $scope.tokenValide = function() {
        var data = { token: $scope.token };
          $http.get('api/valider', date)
          .success(function() {

          }).error(function(data, status) {
            $scope.logout();
          });
      };

      $scope.logout = function() {
        delete $localStorage.token;
        delete $scope.token;
        window.location = "/";
      };

      $scope.token = $localStorage.token;
      if ($scope.token) {
        $scope.tokenValide();
      }
    }]);
