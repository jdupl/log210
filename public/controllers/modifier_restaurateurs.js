var controllers = angular.module('app.controllers.ModifierRestaurateurs', []);

controllers.controller('ModifierRestaurateurs', function($scope, $http) {

  $scope.alerts = [];
  loadRestaurants();
  refreshList();

  $scope.submitRestaurateur = function() {
    $scope.alerts = [];
    var user = $scope.user;
    user.type = 'restaurateur';

    if (!user.restaurants) {
      $scope.alerts.push({msg: "Attention: Le restaurateur n'a pas de restaurant associé !", type: 'warning'});
    }

    $http.post('/api/users', user, {headers: {'Authorization' : 'Bearer ' + $scope.token}})
      .success(function(data) {
        delete $scope.user;
        $scope.alerts.push({msg: "Le restaurateur a été ajouté.", type: 'success'});
        refreshList();
      })
      .error(function(data, status) {
        $scope.alerts.push({msg: "Malheuresement, une erreur est survenue lors de l'inscription et l'utilisateur n'a pas pu être enregistré.", type: 'danger'});
      });
  };

  $scope.modRestaurateur = function(restaurateur) {
    $scope.userModify = restaurateur;
    delete $scope.userModify.password;

    $scope.showModifyForm = true;
  };

  $scope.submitModifyRestaurateur = function() {
    $scope.alerts = [];
    var userModify = $scope.userModify;

    if (!userModify.restaurants) {
      $scope.alerts.push({msg: "Attention: Le restaurateur n'a pas de restaurant associé !", type: 'warning'});
    }

    $http.put('/api/users/' + userModify._id , userModify, {headers: {'Authorization' : 'Bearer ' + $scope.token}})
      .success(function(data) {
        delete $scope.userModify;
        $scope.alerts.push({msg: "Le restaurateur a été modifié.", type: 'success'});
        refreshList();
      })
      .error(function(data, status) {
        $scope.alerts.push({msg: "Malheuresement, une erreur est survenue lors de la modification.", type: 'danger'});
      });
  };

  $scope.deleteRestaurateur = function(restaurateur) {
    $http.delete('/api/users/' + restaurateur._id, {headers: {'Authorization' : 'Bearer ' + $scope.token}})
      .success(function(data) {
        $scope.alerts.push({msg: "Le restaurateur a été supprimé.", type: 'success'});
        refreshList();
      })
  };

  $scope.closeAlert = function(index) {
    $scope.alerts.splice(index, 1);
  };

  function loadRestaurants() {
    $http.get('/api/restaurants', {headers: {'Authorization' : 'Bearer ' + $scope.token}})
      .success(function(data) {
        $scope.restaurants = data;
      });
  }

  function refreshList() {
    $http.get('/api/users?type=restaurateur', {headers: {'Authorization' : 'Bearer ' + $scope.token}})
      .success(function(data) {
        $scope.restaurateurs = data;
      });
    $scope.showList = true;
    $scope.showModifyForm = false;
    $scope.showAddForm = false;
  }

});
