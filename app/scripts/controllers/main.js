'use strict';
/* globals L */

/**
 * @ngdoc function
 * @name jschallengeApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the jschallengeApp
 */
angular.module('jschallengeApp')

.controller('MainCtrl', function($scope, $http) {

  // instantiate leaflet map
  var map = L.map('map');
  map.setView([1.315,103.795], 13);
  $scope.markers = {};

  L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  // Initial query for a booking in 1 day from now, for 2 hours.
  var hourInMillis = 3600 * 1000;
  $scope.booking = {
    bookingHours: 2,
    startDay: 1,
    startHour: 0
  };
  // compute number of hours away based on start day and start hour
  $scope.booking.startTime = function() {
    return parseInt($scope.booking.startDay) * 24 + parseInt($scope.booking.startHour);
  };
  $scope.hideVehicleDetails = true;

  $scope.getBookingAvailability = function() {
    var startInMillis = Date.now() + $scope.booking.startTime() * hourInMillis;
    var endInMillis = startInMillis + $scope.booking.bookingHours * hourInMillis;
    var url = 'http://jschallenge.smove.sg/provider/1/availability?book_start=' + startInMillis + '&book_end=' + endInMillis;

    $http.get(url).success(populateMarkers)
    .error(function(err) {
      // Hum, this is odd ... contact us...
      console.error(err);
    });
  };
  
  $scope.getBookingAvailability();

  function populateDetails(e) {
    //$scope.$apply since leafletJS calls populateDetails that angular is unaware of
    $scope.$apply(function() {
      $scope.hideVehicleDetails = false;
      $scope.vehicle = e.target.options.data;
    });
  }

  function populateMarkers(result) {
    /*jshint camelcase: false */
    var vehicle, coords, existingMarker;

    for (var i = 0; i < result.length; i++) {
      vehicle = result[i];
      coords = [vehicle.latitude, vehicle.longitude];
      existingMarker = $scope.markers[vehicle.id];

      if (vehicle.cars_available > 0) {
        // add marker or update marker's location on map if there are vehicles available
        if (existingMarker) {
          existingMarker.setLatLng(coords);
          existingMarker.options.data = vehicle;
        } else {
          $scope.markers[vehicle.id] = L.marker(coords, { 
                opacity: 0.7,
                data: vehicle
              })
              .addTo(map)
              .bindPopup(vehicle.description)
              .on('click', populateDetails);
        }
      } else {
        // remove marker from map if there are no vehicles available
        if (existingMarker) {
          map.removeLayer(existingMarker);
          $scope.markers[vehicle.id] = null;
        }
      }
    }
    map.setView([1.315,103.795], 13);
  }

});