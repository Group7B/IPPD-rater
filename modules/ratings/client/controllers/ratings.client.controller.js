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
        rating.$remove(function () {
          $location.path('projects');
        }, function (errorResponse) {
          $scope.error = errorResponse.data.message;
        });
      }
      else {
        console.log('No rating specified');
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
      } else if (($scope.posterRating === '0' || $scope.posterRating === 0) && ($scope.presentationRating === '0' || $scope.presentationRating === 0) && ($scope.demoRating === '0' || $scope.demoRating === 0)) {
        $scope.remove($scope.thisRating);
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

          $scope.posterRating = $scope.thisRating.posterRating;
          $scope.presentationRating = $scope.thisRating.presentationRating;
          $scope.demoRating = $scope.thisRating.demoRating;
          $scope.comment = $scope.thisRating.comment;

          $scope.oldPoster = $scope.posterRating;
          $scope.oldPresentation = $scope.presentationRating;
          $scope.oldDemo = $scope.demoRating;
          $scope.oldComment = $scope.comment;
        } else {
          $scope.rated = false;
          $scope.posterRating = 0;
          $scope.presentationRating = 0;
          $scope.demoRating = 0;
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
    
    $scope.posterRadioClasses = ['.posterRank1', '.posterRank2', '.posterRank3'];
    $scope.demoRadioClasses = ['.demoRank1', '.demoRank2', '.demoRank3'];
    $scope.presentationRadioClasses = ['.presentationRank1', '.presentationRank2', '.presentationRank3'];
    
    $scope.updatePosterRankings = function (event, ratingId, rank) {      
      $scope.uncheckRadios(event, $scope.posterRadioClasses[rank-1]);
      
      for (var i = 0; i < $scope.ratedBy.length; ++i) {
        if ($scope.ratedBy[i]._id !== ratingId && $scope.ratedBy[i].posterRank.toString() === event.target.value.toString()) {
          $scope.ratedBy[i].posterRank = "0";
        }
      }
    };
    
    $scope.updateDemoRankings = function (event, ratingId, rank) {      
      $scope.uncheckRadios(event, $scope.demoRadioClasses[rank-1]);
      
      for (var i = 0; i < $scope.ratedBy.length; ++i) {
        if ($scope.ratedBy[i]._id !== ratingId && $scope.ratedBy[i].demoRank.toString() === event.target.value.toString()) {
          $scope.ratedBy[i].demoRank = "0";
        }
      }
    };
    
    $scope.updatePresentationRankings = function (event, ratingId, rank) {      
      $scope.uncheckRadios(event, $scope.presentationRadioClasses[rank-1]);
      
      for (var i = 0; i < $scope.ratedBy.length; ++i) {
        if ($scope.ratedBy[i]._id !== ratingId && $scope.ratedBy[i].presentationRank.toString() === event.target.value.toString()) {
          $scope.ratedBy[i].presentationRank = "0";
        }
      }
    };
    
    $scope.uncheckRadios = function (event, selector) {
      var radios = document.querySelectorAll(selector);
      for (var i = 0; i < radios.length; ++i) {
        if (radios[i] !== event.target) {
          radios[i].checked = false;
        }
      }
    };
  }
]);
