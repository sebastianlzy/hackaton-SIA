'use strict';

/**
 * @ngdoc function
 * @name siahackatonApp.controller:IndexCtrl
 * @description
 * # IndexCtrl
 * Controller of the siahackatonApp
 */
angular.module('siahackatonApp')
  .controller('IndexCtrl', function ($scope, $location, $firebaseArray) {

    var ref = new Firebase("https://siahackaton.firebaseio.com/messages");

    var absUrl = $location.absUrl();
    console.log(absUrl);
    $scope.messages = $firebaseArray(ref);
    $scope.addMessage = function (message) {

      $scope.messages.$add(angular.copy(message));
    };

    window.setInterval(function() {
      var elem = document.getElementById('message-box');
      elem.scrollTop = elem.scrollHeight;
    }, 100);

  });
