'use strict';

/**
 * @ngdoc function
 * @name siahackatonApp.controller:IndexCtrl
 * @description
 * # IndexCtrl
 * Controller of the siahackatonApp
 */
angular.module('siahackatonApp')
  .controller('StartCtrl', function ($scope, $location, $http, $timeout, $window) {
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
            'url' : 'http://www.localhost:9000/#/chat/?name='
        };

        $scope.$watch('buddy.chatOwner', function () {
            var tempName=$scope.buddy['chatOwner'];

            $scope.buddy['url'] = 'http://www.localhost:9000/#/chat/?name=';
            $scope.buddy['url'] += tempName;
        });

        $scope.generateBuddyUrl = function(buddy){

            $scope.buddy['url'] = 'http://www.localhost:9000/#/chat/?name=' + buddy.chatOwner;
            $window.open($scope.buddy['url'], '_blank');
        };

        $scope.addBuddy = function (buddy) {
            console.log(buddy);
            $scope.buddies.push(angular.copy(buddy));

            var url = "https://secure.hoiio.com/open/sms/send?";
            var appID= "app_id=Ts9Wbe2xk2HNFi4f";
            var accessToken= "&access_token=SbRiWZRTw7TVfudb";
            var dest = "&dest=%2B65" + buddy.number;
            var message= "&msg=Hello%20"+buddy.name+"! "+ buddy.chatOwner +"%20has%20invited%20you%20to%20join%20this%20chat:%20http%3A%2F%2Fwww%2Elocalhost%3A9000%2F%23%2F%3Fname%3D"+buddy.name;

            url = url + appID+accessToken+dest+message;

            console.log(buddy.chatOwner);
            console.log(url);
            $http({
              method: 'GET',
              url: url

            }).success(function (response) {
              console.log(response);

            }).error(function (err) {
              $timeout(function () {
                console.log("unable to send message");
              }, 2000)
            });
          }



  });
