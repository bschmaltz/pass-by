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
    $scope.originModel = null;
    $scope.destinationModel = null;
    $scope.directionsError = false;
    var directionsService = new google.maps.DirectionsService();

    $scope.handleFormSubmit = function(){
      var params = {};
      params.o = (this.originAutocomplete.getPlace() !== undefined) ? this.originAutocomplete.getPlace().formatted_address : this.originModel;
      params.d = (this.destinationAutocomplete.getPlace() !== undefined) ? this.destinationAutocomplete.getPlace().formatted_address: this.destinationModel;
      
      var request = {
        origin: params.o,
        destination: params.d,
        travelMode: google.maps.TravelMode.DRIVING
      };
      directionsService.route(request, function(result, status) {
        if (status !== google.maps.DirectionsStatus.OK) {
          $scope.directionsError = true;
        }else{
          $location.path('/results').search(params);
        }
        $scope.$apply();
      });
    }
  });