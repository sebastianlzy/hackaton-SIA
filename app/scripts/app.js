'use strict';

/**
 * @ngdoc overview
 * @name siahackatonApp
 * @description
 * # siahackatonApp
 *
 * Main module of the application.
 */
angular
  .module('siahackatonApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'firebase'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: '../views/collab/main.html',
        controller: 'IndexCtrl'
      })
      .when('/start', {
        templateUrl: 'views/start.html',
        controller: 'StartCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
