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
        console.log($location.url());

        $scope.isActive = function (viewLocation) {
            console.log(viewLocation);
            var active = (viewLocation === $location.url());
            return active;
        };

        var absUrl = $location.absUrl();
        console.log(absUrl);
        $scope.buddies = [];
        $scope.buddy = {
            'name' : '',
            'url' : 'http://localhost:9000/#/?name='
        };

        //hey sebas. cant solve the dirty function. TEACH ME!
        //what i want: to clear the url everytime buddy.name is being changed.
        $scope.$watch('buddy.name', function () {
            var tempName=$scope.buddy['name'];

            $scope.buddy['url'] = 'http://localhost:9000/#/?name='
            $scope.buddy['url'] += tempName;
        });

        $scope.generateBuddyUrl = function(buddy){

            $scope.buddy['url'] = 'http://localhost:9000/#/?name=' + buddy.name
        }

        $scope.addBuddy = function (buddy) {
            console.log(buddy);
            $scope.buddies.push(angular.copy(buddy));
        };


  });
