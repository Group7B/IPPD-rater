'use strict';

//Ratings service used for communicating with the ratings REST endpoints
angular.module('ratings').factory('Ratings', ['$resource',
  function ($resource) {
    return $resource('api/ratings/:ratingId', {
      ratingId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
  /*function ($resource) {
    return $resource ('api/rating', {}, {
      list: {
        method: 'GET'
      }
    });
  }*/
]);
