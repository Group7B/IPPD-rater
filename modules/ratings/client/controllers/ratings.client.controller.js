'use strict';

// Ratings controller
angular.module('ratings').controller('RatingsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Ratings',
  function ($scope, $stateParams, $location, Authentication, Ratings) {
    $scope.authentication = Authentication;
    $scope.sortBy = '_id';
    $scope.sortReverse = true;

    // Create new Rating
    $scope.create = function (isValid) {
      console.log('create');
      $scope.error = null;
      console.log('error');
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'ratingForm');

        return false;
      }
      console.log('create object');
      // Create new Rating object
      /*
      console.log($stateParams.projectId);
      console.log($stateParams.userId);
      console.log(this.posterRating);
      console.log(this.presentationRating);
      console.log(this.demoRating);
      */

      var rating = new Ratings({
        project: $stateParams.projectId,
        posterRating : this.posterRating,
        presentationRating: this.presentationRating,
        demoRating: this.demoRating,
        comment: this.comment
      });
      console.log('object created');

      // Redirect after save
      rating.$save(function (response) {
        $location.path('projects/rank');

        // Clear form fields
        $scope.posterRating = '';
        $scope.presentationRating = '';
        $scope.demoRating = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
      console.log('create complete');
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

      var rating = $scope.rating;

      rating.$update(function () {
        $location.path('ratings/' + rating._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Ratings
    $scope.find = function () {
      $scope.ratings = Ratings.query();
    };

    // Find existing Rating
    $scope.findOne = function () {
      console.log('find one');
      $scope.rating = Ratings.get({
        ratingId: $stateParams.ratingId
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
