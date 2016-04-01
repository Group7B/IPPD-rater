'use strict';

angular.module('users.admin').controller('DataController', ['$scope', '$window', 'Ratings', '$http',
  function ($scope, $window, Ratings, $http) {

    $scope.exportRatings = function () {
      $window.open('api/export', '_blank');
    };
  }
]);