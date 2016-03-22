
'use strict';

/**
 * @ngdoc function
 * @name jschallengeApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the jschallengeApp
 */
var myCar=angular.module('jschallengeApp');

myCar.controller('MainCtrl', function($scope, $http) {

  // Query for a booking in 1 day from now, for 2 hours.
  var start = Date.now() + 24 * 3600 * 1000;
  var end = start + 2 * 3600 * 1000;
  var url = 'http://jschallenge.smove.sg/provider/1/availability?book_start=' + start + '&book_end=' + end;

  $http.get(url).success(function(result) {
    console.log('Result from the API call:', result);
    $scope.cars = result;

    var mapOptions = {
        zoom: 11,
        center: new google.maps.LatLng(1.355878,103.822324),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);

    $scope.markers = [];

    var infoWindow = new google.maps.InfoWindow();

    var createMarker = function (info){

        var marker = new google.maps.Marker({
            map: $scope.map,
            position: new google.maps.LatLng(info.latitude, info.longitude),
            title: info.parking_name
        });
        marker.content = '<div class="infoWindowContent">' + info.description + '</div>';

        google.maps.event.addListener(marker, 'click', function(){
            infoWindow.setContent('<h2>' + marker.title + '</h2>' + marker.content);
            infoWindow.open($scope.map, marker);
        });

        $scope.markers.push(marker);

    };

    $scope.cars.forEach(function (car) {
      // console.log(car.latitude, car.longitude);
      createMarker(car);

    });

  }).error(function(err) {
    // Hum, this is odd ... contact us...
    console.error(err);
  });


});
