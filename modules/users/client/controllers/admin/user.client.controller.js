'use strict';

angular.module('users.admin').controller('UserController', ['$scope', '$state', 'Authentication', 'userResolve', '$filter', 'Ratings', '$stateParams', 'Users',
  function ($scope, $state, Authentication, userResolve, $filter, Ratings, $stateParams, Users) {
    $scope.authentication = Authentication;
    $scope.user = userResolve;

    $scope.findUser = function () {
      var users;
      Users.query(function (data) {
        users = data;
        $scope.oldUser = $filter('filter')(
          users, {
            _id: $stateParams.userId
          })[0];
      });
    };

    $scope.remove = function (user) {
      if (confirm('Are you sure you want to delete this user?')) {
        if (user) {
          user.$remove();

          $scope.users.splice($scope.users.indexOf(user), 1);
        } else {
          $scope.user.$remove(function () {
            $state.go('admin.users');
          });
        }
      }
    };

    $scope.update = function (isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');
        return false;
      }
      var user = $scope.user;
      var oldUser = $scope.oldUser;

      // if the roles changed
      if (user.roles !== oldUser.roles) {

        // check if the judge role was set
        if (user.roles.indexOf('judge') > -1 && oldUser.roles.indexOf('judge') === -1){
          Ratings.query(function (data) {
            var ratings = data;
            var userRatings = $filter('filter')(
              ratings, {
                user: {
                  _id: $stateParams.userId
                }
              });
            for (var i=0; i<userRatings.length; i++) {
              userRatings[i].isJudge = true;
              userRatings[i].$update();
            }
          });
        } // otherwise check if the judge role was unset
        else if (user.roles.indexOf('judge') === -1 && oldUser.roles.indexOf('judge') > -1) {
          Ratings.query(function (data) {
            var ratings = data;
            var userRatings = $filter('filter')(
              ratings, {
                user: {
                  _id: $stateParams.userId
                }
              });
            for (var i=0; i<userRatings.length; i++) {
              userRatings[i].isJudge = false;
              userRatings[i].$update();
            }
          });
        }
        // otherwise no change is necessary
      }

      user.$update(function () {
        $state.go('admin.user', {
          userId: user._id
        });
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
  }

]);
