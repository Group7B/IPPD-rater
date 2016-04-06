'use strict';

// Ratings controller
angular.module('ratings').controller('RatingsController', ['$scope', '$filter', '$stateParams', '$location', '$window', '$state', 'Authentication', 'Ratings', 'Projects',
  function ($scope, $filter, $stateParams, $location, $window, $state, Authentication, Ratings, Projects) {
    $scope.authentication = Authentication;
    $scope.adminListTabSort = 'project.teamName';
    $scope.sortBy = '_id';
    $scope.sortReverse = true;
    if($stateParams.projectId){
      $scope.project = Projects.get({
        projectId: $stateParams.projectId
      });
    }

    $scope.sortTabs = function(tabID, sortString) {
      $scope.adminListTabSort = sortString;
      var tabs = document.querySelectorAll('.listTabButton');
      for (var i = 0; i < tabs.length; ++i) {
        tabs[i].classList.remove('listTabButtonActive');
        tabs[i].classList.remove('accentColor');
      }
      document.querySelector(tabID).classList.add('listTabButtonActive');
      document.querySelector(tabID).classList.add('accentColor');
    };

    $scope.sortType = 'posterRating';
    $scope.sortType2 = '-posterRating';

    $scope.$on('sort', function (event, sortTypes) {
      $scope.sortType = sortTypes[0];
      $scope.sortType2 = sortTypes[1];
    });

    $scope.$on('submitRankings', function (event) {
      $scope.updateRanks();
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
      //$scope.rating = Ratings.get({
      //  ratingId: {
      //    _id: $stateParams.ratingId
      //  }
      //});
    };

    $scope.findRatingByProjectAndUser = function () {
      $scope.isJudge = (Authentication.user.roles.indexOf('judge') > -1) ? true : false;

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

    $scope.findRatingsByUser = function () {
      $scope.ratedBy = {};
      Ratings.query(function (data) {
        var ratings = data;
        $scope.ratedBy = $filter('filter')(
          ratings, {
            user: {
              _id: Authentication.user._id
            }
          });
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

    $scope.deleteAllRatings = function () {
      //warning message
      if(confirm('Do you want to delete all ratings from the database?')) {
        Ratings.query(function (data) {
          $scope.ratings = data;
        });
        var i;
        for (i = 0; i < $scope.ratings.length; i++) {
          $scope.ratings[i].$remove(); //delete all ratings
        }
        $scope.ratings.splice(0, $scope.ratings.length);
        alert('All ratings successfully deleted!');
      }
    };

    $scope.updateRanks = function () {
      for (var i = 0; i < $scope.ratedBy.length; ++i) {
        $scope.ratedBy[i].$update();
      }

      $location.path('projects');
    };
  }
]);
