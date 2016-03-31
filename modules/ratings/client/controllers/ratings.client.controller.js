'use strict';

// Ratings controller
angular.module('ratings').controller('RatingsController', ['$scope', '$filter', '$stateParams', '$location', '$window', '$state', 'Authentication', 'Ratings', 'Projects',
  function ($scope, $filter, $stateParams, $location, $window, $state, Authentication, Ratings, Projects) {
    $scope.authentication = Authentication;
    $scope.sortBy = '_id';
    $scope.sortReverse = true;
    $scope.project = Projects.get({
      projectId: $stateParams.projectId
    });

    // Create new Rating
    $scope.create = function (isValid) {
      var rating = new Ratings({
        project: {
          _id: $stateParams.projectId
        },
        posterRating: $scope.posterRating,
        presentationRating: $scope.presentationRating,
        demoRating: $scope.demoRating,
        comment: $scope.comment,
        isJudge: $scope.isJudge
      });

      rating.$save(function (response) {
        $location.path('projects');
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

      if (!$scope.rated) {
        $scope.create();
        return;
      } else if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'ratingForm');
        return false;
      } else {
        var rating = $scope.thisRating;
        rating.posterRating = $scope.posterRating;
        rating.presentationRating = $scope.presentationRating;
        rating.demoRating = $scope.demoRating;
        rating.comment = $scope.comment;
        rating.isJudge = $scope.isJudge;

        rating.$update(function () {
          $location.path('projects');
        }, function (errorResponse) {
          $scope.error = errorResponse.data.message;
        });
      }
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
        ratingId: {
          _id: $stateParams.ratingId
        }
      });
    };

    $scope.findRatingByProjectAndUser = function () {
      $scope.isJudge = (Authentication.user.roles.indexOf("judge") > -1) ? true : false;

      $scope.thisRating = {};
      Ratings.query(function (data) {
        $scope.ratings = data;
        $scope.thisRating = $filter('filter')(
          $scope.ratings, {
            project: {
              _id: $stateParams.projectId
            },
            user: {
              _id: Authentication.user._id
            }
          });
        if ($scope.thisRating.length > 0) {
          $scope.thisRating = $scope.thisRating[0];
          $scope.rated = true;
        } else {
          $scope.rated = false;
        }
      });
    };
    
    $scope.getRatingsByUser = function (user) {
      var ratedBy = {};
      Ratings.query(function (data) {
        var ratings = data;
        ratedBy = $filter('filter')(
          ratings, {
            user: {
              _id: Authentication.user._id
            }
          });
        
        return ratedBy;
      });
    };

    $scope.getStars = function (num) {
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

    $scope.deleteAllRatings = function() {
      //warning message
      if(confirm("Do you want to delete all ratings from the database?")) {
        $scope.thisRating = {};
        Ratings.query(function (data) {
          $scope.ratings = data;
        });
        var i;
        for (i = 0; i < $scope.ratings.length; i++) {
          $scope.ratings[i].$remove();  //delete all ratings
        }
        $scope.ratings.splice(0, $scope.ratings.length);
        $scope.success = 'All ratings successfully deleted.';
      }
    };

    $scope.updateRank = function(rating) {
      rating.$update(function (err) {
        $scope.error = err;
      });
    };

    $scope.rankRange = function(start, end) {
      var result = [];
      for (var i = start; i <= end; ++i) {
        result.push(i);
      }
      return result;
    };
  }
]);