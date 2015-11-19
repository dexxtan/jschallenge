'use strict';
/* globals fixture */

describe('Controller: MainCtrl', function () {

  // load the controller's module
  beforeEach(module('jschallengeApp'));

  beforeEach(function() {
    fixture.setBase('test');
    this.result = fixture.load('spec/template/index.html', 'mock/availability.json');
  });

  var MainCtrl,
    scope,
    $httpBackend;

  // Initialize the controller and a mock scope
  beforeEach(inject(function (_$httpBackend_, $controller, $rootScope) {
    $httpBackend = _$httpBackend_;
    scope = $rootScope.$new();
    MainCtrl = $controller('MainCtrl', {
      $scope: scope
    });
  }));

  afterEach(function() {
    fixture.cleanup();
  });

  it('should attach an object to the scope with numerical booking parameters', function () {
    expect(scope.booking).toBeDefined();
    expect(scope.booking.bookingHours).toEqual(jasmine.any(Number));
    expect(scope.booking.startDay).toEqual(jasmine.any(Number));
    expect(scope.booking.startHour).toEqual(jasmine.any(Number));
  });

  it('should attach an object to the scope with a computed property which returns a number', function () {
    expect(scope.booking.startTime).toEqual(jasmine.any(Function));
    expect(scope.booking.startTime()).toEqual(jasmine.any(Number));
  });

  it('should attach a flag to the scope which is true by default to hide vehicle details', function () {
    expect(scope.hideVehicleDetails).toBe(true);
  });

  it('should attach a function to the scope', function() {
    expect(scope.getBookingAvailability).toEqual(jasmine.any(Function));
  });

  it('should attach markers to the scope after calling the availability api', function() {
    expect(scope.markers[1]).not.toBeDefined();
    $httpBackend.expectGET(/http:\/\/jschallenge.smove.sg\/provider\/1\/availability\?book_start=\d{5,}&book_end=\d{5,}/)
        .respond(this.result[1]);
    $httpBackend.flush();

    for (var i = 0; i < this.result[1].length; i++) {
      expect(scope.markers[this.result[1][i].id]).toBeDefined();
    }
  });
});
