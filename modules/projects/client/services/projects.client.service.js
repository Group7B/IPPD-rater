'use strict';

//Ratings service used for communicating with the ratings REST endpoints
angular.module('projects').factory('Projects', ['$resource',
  function ($resource) {
    return $resource('api/projects/:projectId', {
      projectId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
