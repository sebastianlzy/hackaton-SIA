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
      var lastMessage = $scope.messages[$scope.messages.length -1];
      if(lastMessage && lastMessage.text.indexOf("VOTING") > -1){
        $scope.voteNow = true;
        $scope.messages.$add({
          name : 'Flybot',
          text : 'You need to vote now! Please choose a number '
        });
        selectedResults.forEach(function (selectedResult, index) {
          console.log(selectedResult);
          addResultToMessage(index, selectedResult['agentName'],
            selectedResult['pricingOption'], selectedResult['outboundLegTime'],
            selectedResult['inboundLegTime']);
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
            name : $routeParams['name'],
            text : 'VOTED for ' + message.text
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
            text : 'We are experiencing some difficulty. Please bear with us'
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

    var i = iValue();
    var getTopFiveFlights = function (response) {
      var agents = response['Agents'];
      var legs = response['Legs'];
      var itineraries = response['Itineraries'].slice(0,2);
      results = [];
      i.setI(0);
      itineraries.forEach(function (itinerary) {
        var inboundLeg = itinerary['InboundLegId'];
        var outboundLeg = itinerary['OutboundLegId'];
        var pricingOptions = itinerary.PricingOptions;
        pricingOptions.forEach(function(pricingOption){
          var agentId = pricingOption['Agents'][0];
          var agentName = findAgentName(agents, agentId) || "TigerAir";
          var inboundLegTime = findLeg(legs, inboundLeg);
          var outboundLegTime = findLeg(legs, outboundLeg);
          results.push({
            'id' : i.getI(),
            'agentName' : agentName,
            'pricingOption' : pricingOption,
            'outboundLegTime' : outboundLegTime,
            'inboundLegTime' : inboundLegTime
          });

          addResultToMessage(i.getI(), agentName, pricingOption, outboundLegTime, inboundLegTime);
          i.increaseI();
        });
      });
      console.log(results);
    };

    function iValue(){
      var i = 0;
      return {
        getI : function () {
          return i;
        },
        setI : function (j) {
          i = j;
        },
        increaseI : function () {
          i = i + 1;
        }
      }
    }

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
          selectedResults.forEach(function (selectedResult, index) {
            console.log(selectedResult);
            addResultToMessage(index, selectedResult['agentName'],
              selectedResult['pricingOption'], selectedResult['outboundLegTime'],
              selectedResult['inboundLegTime']);
          });

        }

        if (text.indexOf('RESULT') > -1) {

          displayResult(
            calculateResult($scope.messages)
          );

        }
      }
    };

    var displayResult = function (userVotingResults) {
        var displayResult = {};
        userVotingResults.forEach(function (userVote) {
          displayResult[userVote.voted] = displayResult[userVote.voted] || [];
          displayResult[userVote.voted].push(userVote.name);
          displayResult[userVote.voted] = displayResult[userVote.voted].sort().reduce(
            function(a, b){ if (b != a[0]) a.unshift(b); return a }, [])
        });



      for(var key in displayResult) {
        $scope.messages.$add({
          name: 'Flybot',
          text: 'Option ' + key + ': ' + displayResult[key].join(", ")
        });
      };

    };


    var calculateResult = function (messages) {
      var userVotingResults = [];
      messages.forEach(function(message){
        if(message.text.match(/VOTED/g)){
          var texts = message.text.split(' ');
          userVotingResults.push({
            name : message.name,
            voted : texts[2]
          })
        }
      });
      return userVotingResults;

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
