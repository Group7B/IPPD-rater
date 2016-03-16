'use strict';

angular.module('projects').controller('ProjectRankingController', ['$scope', '$filter', '$stateParams', '$location', 'Authentication', 'Ratings', 'Projects',
  function ($scope, $filter, $stateParams, $location, Authentication, Ratings, Projects) {
    $scope.authentication = Authentication;

    // Find all projects and ratings
    $scope.find = function () {
      Projects.query(function (data) {
        $scope.projects = data;
        //$scope.buildPager();
      });
      Ratings.query(function (data) {
        $scope.ratings = data;
        console.log($scope.ratings);
      });
    };

    $scope.buildPager = function () {
      $scope.pagedItems = [];
      $scope.itemsPerPage = 15;
      $scope.currentPage = 1;
      $scope.figureOutItemsToDisplay();
    };

    $scope.figureOutItemsToDisplay = function () {
      $scope.filteredItems = $filter('filter')($scope.projects, {
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

    // Find rating associated with project and user
    $scope.findOne = function (pID) {
      $scope.rating = {};

      console.log($scope.ratings);
      $scope.filteredRating = $filter('filter')($scope.ratings, {
        project: pID,
        user: $scope.authentication.user._id
      });
      console.log($scope.filteredRating);
      console.log($scope.filteredRating['0']);

      $scope.rating = $scope.filteredRating['0'];

      console.log($scope.rating.posterRating);
    };
  }
]);
