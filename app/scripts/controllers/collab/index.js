'use strict';

/**
 * @ngdoc function
 * @name siahackatonApp.controller:IndexCtrl
 * @description
 * # IndexCtrl
 * Controller of the siahackatonApp
 */
angular.module('siahackatonApp')
  .controller('IndexCtrl', function ($scope, $routeParams, $firebaseArray, $timeout) {

    var ref = new Firebase("https://siahackaton.firebaseio.com/messages");
    $scope.message  = {name : $routeParams['name'] || 'anonymous'};
    $scope.messages = $firebaseArray(ref);
    $scope.addMessage = function (message) {
      $scope.messages.$add(angular.copy(message));
    };


    $scope.messages.$loaded(function () {
      console.log('hello');
      $timeout(function () {
        var elem = document.getElementById('message-box');
        elem.scrollTop = elem.scrollHeight;
      });

    });


  });
