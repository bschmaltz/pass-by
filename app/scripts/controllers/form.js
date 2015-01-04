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
        o: this.originAutocomplete.getPlace().formatted_address,
        d: this.destinationAutocomplete.getPlace().formatted_address
      };
      $location.path('/results').search(params);
    }
  });