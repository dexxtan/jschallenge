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
  var map = L.map('map').setView([1.315,103.795], 13);

  L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  // Query for a booking in 1 day from now, for 2 hours.
  var start = Date.now() + 24 * 3600 * 1000;
  var end = start + 2 * 3600 * 1000;
  var url = 'http://jschallenge.smove.sg/provider/1/availability?book_start=' + start + '&book_end=' + end;

  function populateDetails(e) {
    $scope.$apply(function(){
      $scope.vehicle = e.target.options.data;
    });
  }

  $http.get(url).success(function(result) {
    var vehicle, coords;

    for (var i = 0; i < result.length; i++) {
      vehicle = result[i];
      coords = [vehicle.latitude, vehicle.longitude];

      L.marker(coords, { 
            opacity: 0.7,
            data: vehicle
          })
          .addTo(map)
          .bindPopup('smove!')
          .on('click', populateDetails);
    }

    $scope.vehicle = vehicle;
  }).error(function(err) {
    // Hum, this is odd ... contact us...
    console.error(err);
  });


});