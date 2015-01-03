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
    var mapOptions =  {
      zoom: 12,
      center: new google.maps.LatLng(10, -10),
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    $scope.resultMap = new google.maps.Map(document.getElementById('results-map-canvas'), mapOptions);
  });
