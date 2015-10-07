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
            $timeout, $http, $firebaseObject) {

    var apiKey = 'ah322701755212619960577281750738';
    var ref = new Firebase("https://siahackaton.firebaseio.com/messages");
    var results = [];
    var selectedResults = [];


    $scope.message = { name: $routeParams['name'] || 'anonymous' };
    $scope.messages = $firebaseArray(ref);
    $scope.usersColor = {};
    $scope.voteNow = false;

    $scope.messages.$watch(function() {
      if($scope.messages[$scope.messages.length -1].text.indexOf("VOTING") > -1){
        console.log("YOU ALL NEED TO VOTE!");
        $scope.voteNow = true;
        $scope.messages.$add({
          name : 'Flybot',
          text : 'You need to vote now!'
        });
      }
    });

    $scope.addMessage = function (message) {
      if($scope.voteNow){
        if(isNaN(message.text)){
          $scope.messages.$add({
            name : 'Flybot',
            text : 'Please insert a valid number!'
          });
        }else{
          $scope.messages.$add({
            name : 'Flybot',
            text : 'You have voted for ' + message.text
          });
          $scope.voteNow = false;
        }


      }else{
        $scope.messages.$add(angular.copy(message));
        checkForKeywords(message.text);
        addUserColors();
        $scope.message.text = "";
      }
      scrollToBottom();

    };

    $scope.messages.$loaded(function () {
      scrollToBottom();
      addUserColors();
    });

    var getFromSkyScanner = function (iataCountry, outbound, inbound) {

      var url = 'http://localhost:3000';
      if (iataCountry !== ''){
        url = url + '?country=' + iataCountry;
      }
      if (outbound !== ''){
        url = url + '&outbound=' + outbound;
      }
      if (inbound !== ''){
        url = url + '&inbound=' + inbound;
      }
      $http({
        method: 'GET',
        url: url

      }).success(function (response) {
        console.log(response);
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

    var findLeg = function (legs, legId) {
      var legTime = '';
      legs.forEach(function (leg) {

        function formatTime(legTime){


          return legTime.split('T').join(" @ ");
        }

        if(leg['Id'] === legId){
          legTime =  formatTime(leg['Departure']) +  " - " + formatTime(leg['Arrival']);
        }
      });

      return legTime;
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
      var legs = response['Legs'];
      var itineraries = response['Itineraries'].slice(0,3);
      itineraries.forEach(function (itinerary) {
        var inboundLeg = itinerary['InboundLegId'];
        var outboundLeg = itinerary['OutboundLegId'];

        var pricingOptions = itinerary.PricingOptions;
        pricingOptions.forEach(function(pricingOption, index){
          var agentId = pricingOption['Agents'][0];
          var agentName = findAgentName(agents, agentId) || "TigerAir";
          var inboundLegTime = findLeg(legs, inboundLeg);
          var outboundLegTime = findLeg(legs, outboundLeg);
          results.push({
            'id' : angular.copy(index),
            'agentName' : agentName,
            'pricingOption' : pricingOption,
            'outboundLegTime' : outboundLegTime,
            'inboundLegTime' : inboundLegTime
          });
          addResultToMessage(index, agentName, pricingOption, outboundLegTime, inboundLegTime);
        });
      });
      console.log(results);
    };

    function addResultToMessage (index, agentName, pricingOption, outboundLegTime, inboundLegTime){
      $scope.messages.$add({
        name : 'Flybot',
        text : agentName + " - " + pricingOption['Price'].toString() + "SGD" + " ------------ " +  "Option [" + index + "]"
      });
      $scope.messages.$add({
        name : 'Outbound',
        text :  outboundLegTime
      });
      $scope.messages.$add({
        name : 'Inbound',
        text :  inboundLegTime
      });
    }

    var checkForKeywords = function (text) {
      if (text !== '') {
        if (text.indexOf('KUL') > -1) {
          var inbound, outbound, startInbound, startOutbound, tempText;
          if (text.indexOf('from') > -1) {
            startOutbound = text.search('2015');
            outbound = text.substring(startOutbound, startOutbound + 10);
            tempText = text.substring(startOutbound + 10);
          }
          if (text.indexOf('to') > -1) {
             startInbound = tempText.search('2015');
             inbound = tempText.substring(startInbound, startInbound + 10);

          }
          getFromSkyScanner('KUL', outbound, inbound);
        }else if (text.indexOf('BKK') > -1) {
          var inbound, outbound, startInbound, startOutbound, tempText;
          if (text.indexOf('from') > -1) {
            startOutbound = text.search('2015');
            outbound = text.substring(startOutbound, startOutbound + 10);
            tempText = text.substring(startOutbound + 10);
          }
          if (text.indexOf('to') > -1) {
            startInbound = tempText.search('2015');
            inbound = tempText.substring(startInbound, startInbound + 10);

          }
          getFromSkyScanner('BKK', outbound, inbound);
        }else if (text.indexOf('PEK') > -1) {
          var inbound, outbound, startInbound, startOutbound, tempText;
          if (text.indexOf('from') > -1) {
            startOutbound = text.search('2015');
            outbound = text.substring(startOutbound, startOutbound + 10);
            tempText = text.substring(startOutbound + 10);
          }
          if (text.indexOf('to') > -1) {
            startInbound = tempText.search('2015');
            inbound = tempText.substring(startInbound, startInbound + 10);

          }
          getFromSkyScanner('PEK', outbound, inbound);
        }else if (text.indexOf('ES') > -1) {
          var inbound, outbound, startInbound, startOutbound, tempText;
          if (text.indexOf('from') > -1) {
            startOutbound = text.search('2015');
            outbound = text.substring(startOutbound, startOutbound + 10);
            tempText = text.substring(startOutbound + 10);
          }
          if (text.indexOf('to') > -1) {
            startInbound = tempText.search('2015');
            inbound = tempText.substring(startInbound, startInbound + 10);

          }
          getFromSkyScanner('ES', outbound, inbound);
        }
        if (text.indexOf('ADD') > -1) {
          var selectedOption = text.substring(text.indexOf('ADD')+4, text.indexOf('ADD')+5);
          selectedResults.push(results[selectedOption]);
          $scope.messages.$add({
            name : 'Flybot',
            text : 'ADDED ' + selectedOption
          });
        }

        if (text.indexOf('DISPLAY') > -1) {
          selectedResults.forEach(function (selectedResult) {
            console.log(selectedResult);
            addResultToMessage(selectedResult['id'], selectedResult['agentName'],
              selectedResult['pricingOption'], selectedResult['outboundLegTime'],
              selectedResult['inboundLegTime']);
          });

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
