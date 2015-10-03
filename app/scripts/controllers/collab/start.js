'use strict';

/**
 * @ngdoc function
 * @name siahackatonApp.controller:IndexCtrl
 * @description
 * # IndexCtrl
 * Controller of the siahackatonApp
 */
angular.module('siahackatonApp')
  .controller('StartCtrl', function ($scope, $location) {

        var absUrl = $location.absUrl();
        console.log(absUrl);
        $scope.buddies = [];
        $scope.buddy = {
            'name' : '',
            'url' : 'http://localhost:9000/#/?name='
        }

        $scope.$watch('buddy.name', function () {
            $scope.buddy['url'] += $scope.buddy['name'];
        });

        $scope.generateBuddyUrl = function(buddy){
            $scope.buddy['url'] = 'http://localhost:9000/#/?name=' + buddy.name
        }

        $scope.addBuddy = function (buddy) {
            console.log(buddy);
            $scope.buddies.push(angular.copy(buddy));
        };


  });
