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

    var checkForKeywords = function (text) {
      if(text !== ''){
        if(text.indexOf('KUL') > -1){
          $timeout(function () {
            $scope.messages.$add({
              name : 'Fly',
              text : '1130 - 1230 flight to KUL at 130 SGD tomorrow'
            });
          }, 2000)
        }
      }
    };
    $scope.addMessage = function (message) {
      $scope.messages.$add(angular.copy(message));
      checkForKeywords(message.text);
      $scope.message.text = "";
      scrollToBottom();
    };


    $scope.messages.$loaded(function () {
      scrollToBottom();

    });

    var scrollToBottom = function () {
      $timeout(function () {
        var elem = document.getElementById('message-box');
        elem.scrollTop = elem.scrollHeight;
      });
    }


  });
