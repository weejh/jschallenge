'use strict';

/**
 * @ngdoc function
 * @name jschallengeApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the jschallengeApp
 */
var myCar = angular.module('jschallengeApp');

myCar.controller('MainCtrl', function($scope, $http) {

  // Query for a booking in 1 day from now, for 2 hours.
  var start = Date.now() + 24 * 3600 * 1000;
  var end = start + 2 * 3600 * 1000;
  var url = 'http://jschallenge.smove.sg/provider/1/availability?book_start=' + start + '&book_end=' + end;

  $http.get(url).success(function(results) {
    console.log('Result from the API call:', results);
    console.log(results[0].description);
    $scope.cars = results;
    return results;
  }).error(function(err) {
    // Hum, this is odd ... contact us...
    console.error(err);
  });


});

myCar.directive('myMaps', function (){
  return {
    restrict: 'E',
    scope: {
       Lat: '@',
       Lng: '@'
    },
    template: '<div></div>',
    replace: true,
    link: function(scope, element, attrs){
      var myLatLng = new google.maps.LatLng(scope.Lat, scope.Lng);

      var mapOptions = {
        center: myLatLng,
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      var map = new google.maps.Map(document.getElementById(attrs.id), mapOptions);

      var marker = new google.maps.Marker({
        position: myLatLng,
        map: map,
        title: 'Hello World!'
      });

      marker.setMap(map);

    }
  };
});
