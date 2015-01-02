'use strict';

/**
 * @ngdoc function
 * @name passByApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the passByApp
 */
angular.module('passByApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
