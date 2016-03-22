
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

//auto zoom and auto center
    var bounds  = new google.maps.LatLngBounds();

    $scope.markers = [];

// info window
    var infoWindow = new google.maps.InfoWindow();

// create marker
    var createMarker = function (info){

// property of the marker
        var marker = new google.maps.Marker({
            map: $scope.map,
            position: new google.maps.LatLng(info.latitude, info.longitude),
            animation: google.maps.Animation.DROP,
            title: info.parking_shortname,
            cars_available: info.cars_available
        });

  // content of the info window
        marker.content =  '<div class="infoWindowContent">' +
                          '<span>' + 'Cars available: ' + info.cars_available + '<br>' + '</span>' +
                          '<span>' + 'Location: ' + info.parking_name + '<br>' + '</span>' +
                          '<span>' + 'Detail: ' + info.description + '<br>' + '</span>' +
                          '</div>';

// display info when marker is selected
        google.maps.event.addListener(marker, 'click', function(){
            infoWindow.setContent('<h2>' + marker.title + '</h2>' + marker.content);
            infoWindow.open($scope.map, marker);
            $scope.map.setCenter(marker.getPosition());
            $scope.map.setZoom(14);
        });

        $scope.markers.push(marker);

// store the new marker info, as to create auto zoom and auto center that fit all markers
        var loc = new google.maps.LatLng(marker.position.lat(), marker.position.lng());
        bounds.extend(loc);

    };

// plot the map with the data external service
    var drawMap =  function () {
      $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);

      $scope.cars.forEach(function (car) {
        createMarker(car);

      });

// auto zoom and auto centre that fit all markers
      $scope.map.fitBounds(bounds);
      $scope.map.panToBounds(bounds);
    };

// plot map
    drawMap();

// display detail based on selected marker
    $scope.openInfoWindow = function(e, selectedMarker){
        e.preventDefault();
        google.maps.event.trigger(selectedMarker, 'click');
    };

// reset the map after close of info window
    google.maps.event.addListener(infoWindow, 'closeclick', function(){
        drawMap();
    });


  }).error(function(err) {
    // Hum, this is odd ... contact us...
    console.error(err);
  });

});
