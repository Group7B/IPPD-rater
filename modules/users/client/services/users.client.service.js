'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource',
  function ($resource) {
    return $resource('api/users', {}, {
      update: {
        method: 'PUT'
      },
      deleteAllUsers: {
        method: 'DELETE'
      }
    });
  }
]);

//TODO this should be Users service
angular.module('users.admin').factory('Admin', ['$resource',
  function ($resource) {
    return $resource('api/users/:userId', {
      userId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);

angular.module('users.admin').factory('Theme', ['$resource',
  function ($resource) {
    return $resource('api/theme', {}, {
      update: {
        method: 'PUT'
      }
    });
  }
]);

angular.module('users').service('sharedLogoUrl', function () {
  var property = {
    logoUrl: ''
  };

  return {
    getProperty: function () {
      return property;
    },
    setProperty: function (value) {
      property.logoUrl = value;
    }
  };

});
