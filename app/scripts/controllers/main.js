'use strict';

/**
 * @ngdoc function
 * @name jschallengeApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the jschallengeApp
 */
angular.module('jschallengeApp')

.controller('MainCtrl', function($scope, $http) {

  // Query for a booking in 1 day from now, for 2 hours.
  var start = Date.now() + 24 * 3600 * 1000;
  var end = start + 2 * 3600 * 1000;
  var url = 'http://jschallenge.smove.sg/provider/1/availability?book_start=' + start + '&book_end=' + end;

  $http.get(url).success(function(results) {
    console.log('Result from the API call:', results);
    console.log(results[0].description);
    $scope.cars = results;
  }).error(function(err) {
    // Hum, this is odd ... contact us...
    console.error(err);
  });


});
