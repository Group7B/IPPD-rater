'use strict';

// Ratings controller
angular.module('ratings').controller('RatingsController', ['$scope', '$filter', '$stateParams', '$location', 'Authentication', 'Ratings', 'Projects',
  function ($scope, $filter, $stateParams, $location, Authentication, Ratings, Projects) {
    $scope.authentication = Authentication;
    $scope.project = Projects.get({
      projectId: $stateParams.projectId
    });

    // Create new Rating
    $scope.create = function (isValid) {
      var rating = new Ratings({
        project: $stateParams.projectId,
        posterRating : 0,
        presentationRating: 0,
        demoRating: 0,
        comment: ''
      });

      // Find newly saved rating after save
      rating.$save(function (response) {
        Ratings.query(function (data) {
          $scope.ratings = data;
          $scope.thisRating = $filter('filter')(
            $scope.ratings, {
              project: $stateParams.projectId,
              user: Authentication.user._id
            });
          $scope.thisRating = $scope.thisRating[0];
        });
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Rating
    $scope.remove = function (rating) {
      if (rating) {
        rating.$remove();

        for (var i in $scope.ratings) {
          if ($scope.ratings[i] === rating) {
            $scope.ratings.splice(i, 1);
          }
        }
      } else {
        $scope.rating.$remove(function () {
          $location.path('ratings');
        });
      }
    };

    // Update existing Rating
    $scope.update = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'ratingForm');
        return false;
      }

      var rating = $scope.thisRating;
      rating.posterRating = $scope.posterRating;
      rating.presentationRating = $scope.presentationRating;
      rating.demoRating = $scope.demoRating;
      rating.comment = $scope.comment;

      rating.$update(function () {
        $location.path('projects');
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Ratings
    $scope.find = function () {
      $scope.ratings = {};
      Ratings.query(function (data) {
        $scope.ratings = data;
      });
    };

    // Find existing Rating
    $scope.findOne = function () {
      $scope.rating = Ratings.get({
        ratingId: $stateParams.ratingId
      });
    };

    $scope.findRatingByProjectAndUser = function () {
      $scope.thisRating = {};
      Ratings.query(function (data) {
        $scope.ratings = data;
        $scope.thisRating = $filter('filter')(
          $scope.ratings, {
            project: $stateParams.projectId,
            user: Authentication.user._id
          });
        if ($scope.thisRating.length > 0) {
          $scope.thisRating = $scope.thisRating[0];
        }
        else {
          $scope.create();
        }
        console.log($scope.thisRating);
      });
    };

    $scope.getStars = function(num) {
      var rating = 'Unrated';

      if (num) {
        rating = '★';

        var i;
        for (i = 1; i < num; i++) {
          rating += '★';
        }
      }
      return rating;
    };
  }
]);
