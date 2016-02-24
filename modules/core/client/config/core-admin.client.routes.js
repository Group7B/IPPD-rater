'use strict';

// Setting up route
angular.module('core.admin.routes').config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider
      .state('admin', {
        abstract: true,
        url: '/admin',
        templateUrl: 'modules/users/client/views/admin/admin.client.view.html',
        data: {
          roles: ['admin']
        }
      });
  }
]);
