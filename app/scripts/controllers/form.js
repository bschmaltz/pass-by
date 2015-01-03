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
    $scope.handleFormSubmit = function(){
      var params = {
        origin: this.start,
        destination: this.destination
      };
      $location.path('/results').search(params);
    }
  });
