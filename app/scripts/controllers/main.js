
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

    $scope.markers = [];

    var infoWindow = new google.maps.InfoWindow();

    var createMarker = function (info){

        var marker = new google.maps.Marker({
            map: $scope.map,
            position: new google.maps.LatLng(info.latitude, info.longitude),
            animation: google.maps.Animation.DROP,
            title: info.parking_shortname,
            cars_available: info.cars_available
        });
        marker.content =  '<div class="infoWindowContent">' +
                          '<span>' + 'Cars available: ' + info.cars_available + '<br>' + '</span>' +
                          '<span>' + 'Location: ' + info.parking_name + '<br>' + '</span>' +
                          '<span>' + 'Detail: ' + info.description + '<br>' + '</span>' +
                          '</div>';

        google.maps.event.addListener(marker, 'click', function(){
            infoWindow.setContent('<h2>' + marker.title + '</h2>' + marker.content);
            infoWindow.open($scope.map, marker);
            $scope.map.setZoom(13);
        });

        $scope.markers.push(marker);

    };

    var drawMap =  function () {
      $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);

      $scope.cars.forEach(function (car) {
        createMarker(car);

      });
    };

    drawMap();

    $scope.openInfoWindow = function(e, selectedMarker){
        e.preventDefault();
        google.maps.event.trigger(selectedMarker, 'click');
    };

    google.maps.event.addListener(infoWindow, 'closeclick', function(){
        drawMap();
    });


  }).error(function(err) {
    // Hum, this is odd ... contact us...
    console.error(err);
  });

});
