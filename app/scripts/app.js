'use strict';

/**
 * @ngdoc overview
 * @name passByApp
 * @description
 * # passByApp
 *
 * Main module of the application.
 */
angular
  .module('passByApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/form.html',
        controller: 'FormCtrl'
      })
      .when('/results', {
        templateUrl: 'views/results.html',
        controller: 'ResultsCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
