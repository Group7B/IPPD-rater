'use strict';

angular.module('users.admin').controller('UserController', ['$scope', '$state', 'Authentication', 'userResolve', 'Users',
  function ($scope, $state, Authentication, userResolve, Users) {
    $scope.authentication = Authentication;
    $scope.user = userResolve;

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

      user.$update(function () {
        $state.go('admin.user', {
          userId: user._id
        });
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    $scope.deleteAllUsers = function() {
      //warning message
      if(confirm("Do you want to delete all users (with the exception of admins) from the database?")) {
        Users.query(function (data) {
          $scope.users = data;
        });
        var i;
        for (i = 0; i < $scope.users.length; i++) {
          $scope.isAdmin = ($scope.users[i].roles.indexOf("admin") > -1) ? true : false;
          if (!$scope.isAdmin) {
            console.log($scope.users[i]);
            $scope.users[i].$remove();  //delete non-admin user
            $scope.users.splice($scope.users.indexOf($scope.users[i]), 1);
          }
        }
        $scope.success = 'All users (save for admins) successfully deleted.';
      }
    };
  }
]);
