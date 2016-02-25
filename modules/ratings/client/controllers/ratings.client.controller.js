'use strict';

// Ratings controller
angular.module('ratings').controller('RatingsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Ratings',
  function ($scope, $stateParams, $location, Authentication, Ratings) {
        $scope.authentication = Authentication;

        // Create new Rating
        $scope.create = function (isValid) {
            $scope.error = null;

            if (!isValid) {
                $scope.$broadcast('show-errors-check-validity', 'ratingForm');

                return false;
            }

            // Create new Rating object
            var rating = new Ratings({
                title: this.title,
                content: this.content
            });

            // Redirect after save
            rating.$save(function (response) {
                $location.path('ratings/' + response._id);

                // Clear form fields
                $scope.title = '';
                $scope.content = '';
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
            console.log("Finding ratings!");
        };

        // Find existing Rating
        $scope.findOne = function () {
            $scope.rating = Ratings.get({
                ratingId: $stateParams.ratingId
            });
        };


        $scope.findByUser = function () {
            var userId = $stateParams.userId;
            $scope.ratings = Ratings.find({
                "user": userId
            });
            console.log("userId is %d", userId);
        };

        $scope.findByProj = function () {
            var projID = $stateParams.projectId;
            $scope.presCount = Ratings.find({
                project: projID,
                presentationRating: 5
            }).count();
        };
  }
]);