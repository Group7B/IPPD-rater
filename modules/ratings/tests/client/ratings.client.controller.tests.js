'use strict';

(function () {
  // Ratings Controller Spec
  describe('Ratings Controller Tests', function () {
    // Initialize global variables
    var RatingsController,
      scope,
      $httpBackend,
      $stateParams,
      $location,
      Authentication,
      Ratings,
      mockRating;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, _Authentication_, _Ratings_) {
      // Set a new global scope
      scope = $rootScope.$new();

      // Point global variables to injected services
      $stateParams = _$stateParams_;
      $httpBackend = _$httpBackend_;
      $location = _$location_;
      Authentication = _Authentication_;
      Ratings = _Ratings_;

      // create mock rating
      mockRating = new Ratings({
        _id: '525a8422f6d0f87f0e407a33',
        title: 'An Rating about MEAN',
        content: 'MEAN rocks!'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Ratings controller.
      RatingsController = $controller('RatingsController', {
        $scope: scope
      });
    }));

    it('$scope.find() should create an array with at least one rating object fetched from XHR', inject(function (Ratings) {
      // Create a sample ratings array that includes the new rating
      var sampleRatings = [mockRating];

      // Set GET response
      $httpBackend.expectGET('api/ratings').respond(sampleRatings);

      // Run controller functionality
      scope.find();
      $httpBackend.flush();

      // Test scope value
      expect(scope.ratings).toEqualData(sampleRatings);
    }));

    it('$scope.findOne() should create an array with one rating object fetched from XHR using a ratingId URL parameter', inject(function (Ratings) {
      // Set the URL parameter
      $stateParams.ratingId = mockRating._id;

      // Set GET response
      $httpBackend.expectGET(/api\/ratings\/([0-9a-fA-F]{24})$/).respond(mockRating);

      // Run controller functionality
      scope.findOne();
      $httpBackend.flush();

      // Test scope value
      expect(scope.rating).toEqualData(mockRating);
    }));

    describe('$scope.create()', function () {
      var sampleRatingPostData;

      beforeEach(function () {
        // Create a sample rating object
        sampleRatingPostData = new Ratings({
          title: 'An Rating about MEAN',
          content: 'MEAN rocks!'
        });

        // Fixture mock form input values
        scope.title = 'An Rating about MEAN';
        scope.content = 'MEAN rocks!';

        spyOn($location, 'path');
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (Ratings) {
        // Set POST response
        $httpBackend.expectPOST('api/ratings', sampleRatingPostData).respond(mockRating);

        // Run controller functionality
        scope.create(true);
        $httpBackend.flush();

        // Test form inputs are reset
        expect(scope.title).toEqual('');
        expect(scope.content).toEqual('');

        // Test URL redirection after the rating was created
        expect($location.path.calls.mostRecent().args[0]).toBe('ratings/' + mockRating._id);
      }));

      it('should set scope.error if save error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/ratings', sampleRatingPostData).respond(400, {
          message: errorMessage
        });

        scope.create(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      });
    });

    describe('$scope.update()', function () {
      beforeEach(function () {
        // Mock rating in scope
        scope.rating = mockRating;
      });

      it('should update a valid rating', inject(function (Ratings) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/ratings\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        scope.update(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($location.path()).toBe('/ratings/' + mockRating._id);
      }));

      it('should set scope.error to error response message', inject(function (Ratings) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/ratings\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        scope.update(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      }));
    });

    describe('$scope.remove(rating)', function () {
      beforeEach(function () {
        // Create new ratings array and include the rating
        scope.ratings = [mockRating, {}];

        // Set expected DELETE response
        $httpBackend.expectDELETE(/api\/ratings\/([0-9a-fA-F]{24})$/).respond(204);

        // Run controller functionality
        scope.remove(mockRating);
      });

      it('should send a DELETE request with a valid ratingId and remove the rating from the scope', inject(function (Ratings) {
        expect(scope.ratings.length).toBe(1);
      }));
    });

    describe('scope.remove()', function () {
      beforeEach(function () {
        spyOn($location, 'path');
        scope.rating = mockRating;

        $httpBackend.expectDELETE(/api\/ratings\/([0-9a-fA-F]{24})$/).respond(204);

        scope.remove();
        $httpBackend.flush();
      });

      it('should redirect to ratings', function () {
        expect($location.path).toHaveBeenCalledWith('ratings');
      });
    });
  });
}());
