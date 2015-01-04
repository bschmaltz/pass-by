'use strict';

/**
 * @ngdoc function
 * @name passByApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the passByApp
 */
angular.module('passByApp')
  .controller('FormCtrl', function ($scope, $location) {
    $scope.originAutocomplete = new google.maps.places.Autocomplete(document.getElementById('origin'));
    $scope.destinationAutocomplete = new google.maps.places.Autocomplete(document.getElementById('destination'));

    $scope.handleFormSubmit = function(){
      var params = {
        oLat: getLat(this.originAutocomplete.getPlace()),
        oLon: getLon(this.originAutocomplete.getPlace()),
        dLat: getLat(this.destinationAutocomplete.getPlace()),
        dLon: getLon(this.destinationAutocomplete.getPlace())
      };
      $location.path('/results').search(params);
    }
  });

function getLat(place){
  return place.geometry.location.toString().split(", ")[0].slice(1);
}

function getLon(place){
  return place.geometry.location.toString().split(", ")[1].slice(0, -1);
}