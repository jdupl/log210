var controllers = angular.module('app.controllers.Livrer', []);

controllers.controller('Livrer', function($scope, $http, Auth) {
  var map, directionsService, directionsDisplay;
  $scope.showMap = false;

  var mapOptions = {
    zoom: 8,
    center: new google.maps.LatLng(45.5, -73.6),
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  function init() {
    map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
    directionsService = new google.maps.DirectionsService();
    directionsDisplay = new google.maps.DirectionsRenderer();
    directionsDisplay.setMap(map);
  }

  $scope.update = function (start, end) {
    if (!map) {
      init();
    }

    var request = {
      origin: start,
      destination: end,
      travelMode: google.maps.TravelMode.DRIVING
    };

    directionsService.route(request, function(response, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        directionsDisplay.setDirections(response);
        $scope.showMap = true;
      }
    });
  }

  // à changer
  var start = "éts montreal";
  var end = "1045 rue ottawa montréal";
  $scope.update(start, end);

});
