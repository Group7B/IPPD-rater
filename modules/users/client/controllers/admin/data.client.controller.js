'use strict';

angular.module('users.admin').controller('DataController', ['$scope', 'Ratings', '$http',
  function ($scope, Ratings, $http) {

    $scope.exportRatings = function () {
      $http({
        method: 'GET',
        url: '/api/export'
      }).then(function successCallback(response) {
        console.log('Response:');
        console.log(response);
      }, function errorCallback(response) {
        console.log('Error:');
        console.log(response);
      });
    };
  }
]);