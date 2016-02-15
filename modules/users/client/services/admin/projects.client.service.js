'use strict';

// Projects service used for communicating with the ratings REST endpoints
angular.module('users').factory('Projects', ['$resource',
  function ($resource) {
    return $resource('api/projects/create', {
      projectId: '@_id'
    }, {
      create: {
        method: 'PUT'
      }
    });
  }
]);
