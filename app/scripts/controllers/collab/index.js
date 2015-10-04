'use strict';

/**
 * @ngdoc function
 * @name siahackatonApp.controller:IndexCtrl
 * @description
 * # IndexCtrl
 * Controller of the siahackatonApp
 */
angular.module('siahackatonApp')
  .controller('IndexCtrl',
  function ($scope, $routeParams, $firebaseArray,
            $timeout, $http) {

    var apiKey = 'ah322701755212619960577281750738';
    var ref = new Firebase("https://siahackaton.firebaseio.com/messages");
    $scope.message = { name: $routeParams['name'] || 'anonymous' };
    $scope.messages = $firebaseArray(ref);
    $scope.usersColor = {};

    $scope.addMessage = function (message) {
      $scope.messages.$add(angular.copy(message));
      checkForKeywords(message.text);
      addUserColors();
      $scope.message.text = "";
      scrollToBottom();
    };

    $scope.messages.$loaded(function () {
      scrollToBottom();
      addUserColors();
    });

    var postToSkyScanner = function () {

      $http({
        method: 'GET',
        url: 'http://localhost:3000',
      }).success(function (response) {
        getTopFiveFlights(response);

      }).error(function (err) {
        $timeout(function () {
          $scope.messages.$add({
            name : 'Flybot',
            text : '1130 - 1230 flight to KUL at 130 SGD tomorrow'
          });
        }, 2000)
      });
    };

    var findAgentName = function (agents, agentId) {
      var agentName = "TigerAir"
      agents.forEach(function (agent) {
        if(agentId === agent["Id"]){
          agentName = agent["Name"];
        }
      });
      return agentName;

    };


    var getTopFiveFlights = function (response) {
      var agents = response['Agents'];
      var itineraries = response['Itineraries'].slice(0, 2);
      var that = itineraries;
      itineraries.forEach(function (itinerary) {
        var itinerary = itinerary;
        var pricingOptions = itinerary.PricingOptions;

        pricingOptions.forEach(function(pricingOption){
          var agentId = pricingOption['Agents'][0];
          var agentName = findAgentName(agents, agentId) || "TigerAir";
          $scope.messages.$add({
            name : 'Flybot',
            text :  agentName + " - " + pricingOption['Price'].toString() + "SGD"
          });
        });
      });
    };

    var checkForKeywords = function (text) {
      if (text !== '') {
        if (text.indexOf('KUL') > -1) {
          postToSkyScanner();


        }
      }
    };

    var addUserColors = function () {
      $scope.messages.forEach(function (message) {
        if (!$scope.usersColor[message.name]) {
          $scope.usersColor[message.name] = getRandomRolor();
        }
      })
    };

    var getRandomRolor = function () {
      var letters = '012345'.split('');
      var color = '#';
      color += letters[Math.round(Math.random() * 5)];
      letters = '0123456789ABCDEF'.split('');
      for (var i = 0; i < 5; i++) {
        color += letters[Math.round(Math.random() * 15)];
      }
      return color;
    };

    var scrollToBottom = function () {
      $timeout(function () {
        var elem = document.getElementById('message-box');
        elem.scrollTop = elem.scrollHeight;
      });
    }

  });
