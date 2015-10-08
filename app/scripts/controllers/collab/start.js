'use strict';

/**
 * @ngdoc function
 * @name siahackatonApp.controller:IndexCtrl
 * @description
 * # IndexCtrl
 * Controller of the siahackatonApp
 */
angular.module('siahackatonApp')
  .controller('StartCtrl', function ($scope, $location, $http, $timeout) {
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

            $scope.buddy['url'] = 'http://www.localhost:9000/#/?name='
            $scope.buddy['url'] += tempName;
        });

        $scope.generateBuddyUrl = function(buddy){

            $scope.buddy['url'] = 'http://www.localhost:9000/#/?name=' + buddy.name
        };

        $scope.addBuddy = function (buddy) {
            console.log(buddy);
            $scope.buddies.push(angular.copy(buddy));

            var url = "https://secure.hoiio.com/open/sms/send?";
            var appID= "app_id=Ts9Wbe2xk2HNFi4f";
            var accessToken= "&access_token=SbRiWZRTw7TVfudb";
            var dest = "&dest=%2B65" + buddy.number;
            var message= "&msg=Hello%20"+buddy.name+"! Your%20buddy%20has%20invited%20you%20to%20join%20this%20chat: "+buddy.url;

            url = url + appID+accessToken+dest+message;

            console.log(dest);
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
