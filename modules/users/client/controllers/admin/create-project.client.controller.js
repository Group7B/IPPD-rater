'use strict';

angular.module('users.admin').controller('CreateProjectController', ['$scope', '$state', 'Authentication', 'userResolve',
  function ($scope, $state, $stateParams, $location, Authentication, userResolve, Ratings) {
    $scope.authentication = Authentication;
    $scope.user = userResolve;

    $scope.create = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'ratingForm');

        return false;
      }

      // Create new Rating object
      var rating = new Ratings({
        teamName: this.teamName,
        description: this.description,
        logo: this.logo
      });

      // Redirect after save
      rating.$save(function (response) {
        $location.path('ratings/' + response._id);

        // Clear form fields
        $scope.teamName = '';
        $scope.description = '';
        $scope.logo = '';
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
      $scope.rating = Ratings.get({
        ratingId: $stateParams.ratingId
      });
    };
  }
]);
