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
        templateUrl: '../views/collab/start.html',
        controller: 'StartCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .config(['$httpProvider', function ($httpProvider) {
    // Intercept POST requests, convert to standard form encoding
    $httpProvider.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
    $httpProvider.defaults.transformRequest.unshift(function (data, headersGetter) {
      var key, result = [];

      if (typeof data === "string")
        return data;

      for (key in data) {
        if (data.hasOwnProperty(key))
          result.push(encodeURIComponent(key) + "=" + encodeURIComponent(data[key]));
      }
      return result.join("&");
    });
  }])
  .run(function ($rootScope, $location) {
    $rootScope.isActive = function (viewLocation) {
      return viewLocation === $location.path();
    };
  });
