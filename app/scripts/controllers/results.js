'use strict';

/**
 * @ngdoc function
 * @name passByApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the passByApp
 */
angular.module('passByApp')
  .controller('ResultsCtrl', function ($scope, $routeParams) {
    var directionsDisplay = new google.maps.DirectionsRenderer();
    var directionsService = new google.maps.DirectionsService();
    var mapOptions = {}
    $scope.resultMap = new google.maps.Map(document.getElementById('results-map-canvas'), mapOptions);
    directionsDisplay.setMap($scope.resultMap);
    
    var request = {
      origin: $routeParams.o,
      destination: $routeParams.d,
      travelMode: google.maps.TravelMode.DRIVING
    };
    directionsService.route(request, function(result, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        directionsDisplay.setDirections(result);
      }
    });
  });