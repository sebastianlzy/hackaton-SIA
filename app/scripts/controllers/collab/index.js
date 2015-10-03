'use strict';

/**
 * @ngdoc function
 * @name siahackatonApp.controller:IndexCtrl
 * @description
 * # IndexCtrl
 * Controller of the siahackatonApp
 */
angular.module('siahackatonApp')
  .controller('IndexCtrl', function ($scope) {

    var messages = [];

    $scope.addMessage = function (message) {
      messages.push(angular.copy(message));
    };

    $scope.getMessages = function () {
      return messages;
    };

  });
