'use strict';

angular.module('users.admin').controller('UserListController', ['$scope', '$filter', '$state', 'Users', '$stateParams',
  function ($scope, $filter, $state, Users, $stateParams) {
    $scope.find = function() {
      Users.query(function (data) {
        $scope.users = data;
        $scope.buildPager();
        console.log($scope.users);
      });
    };

    $scope.buildPager = function () {
      $scope.pagedItems = [];
      $scope.itemsPerPage = 15;
      $scope.currentPage = 1;
      $scope.figureOutItemsToDisplay();
    };

    $scope.figureOutItemsToDisplay = function () {
      $scope.filteredItems = $filter('filter')($scope.users, {
        $: $scope.search
      });
      $scope.filterLength = $scope.filteredItems.length;
      var begin = (($scope.currentPage - 1) * $scope.itemsPerPage);
      var end = begin + $scope.itemsPerPage;
      $scope.pagedItems = $scope.filteredItems.slice(begin, end);
    };

    $scope.pageChanged = function () {
      $scope.figureOutItemsToDisplay();
    };

    $scope.DeleteAllUsers = function() {
      //warning message
      if(confirm("Do you want to delete all users (with the exception of admins) from the database?")) {
        Users.deleteAllUsers();
        alert('All users (save for admins) deleted!');
        location.reload();

      }
    };
  }
]);
