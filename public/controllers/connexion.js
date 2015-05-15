angular.module('app.controllers.connexion', [])
//Controller
.controller('ConnexionCtrl', [
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
        };

    		$http.post('/api/login', data)
					.success(function(data){
		        if (res.type === false) {

	            $scope.token = '';
		        } else {

	            $localStorage.token = res.data.token;
	            $scope.token = $localStorage.token;
	            window.location = "/";
		        }
	      	})
					.error(function(data, status){
            $rootScope.error = 'Failed to signin';
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
      if($scope.token) {
      	$scope.tokenValide();
      }
    }]);
