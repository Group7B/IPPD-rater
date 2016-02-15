'use strict';

// Setting up route
angular.module('users.admin.routes').config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider
      .state('admin.users', {
        url: '/users',
        templateUrl: 'modules/users/client/views/admin/list-users.client.view.html',
        controller: 'UserListController'
      })
      .state('admin.user', {
        url: '/users/:userId',
        templateUrl: 'modules/users/client/views/admin/view-user.client.view.html',
        controller: 'UserController',
        resolve: {
          userResolve: ['$stateParams', 'Admin', function ($stateParams, Admin) {
            return Admin.get({
              userId: $stateParams.userId
            });
          }]
        }
      })
      .state('admin.user-edit', {
        url: '/users/:userId/edit',
        templateUrl: 'modules/users/client/views/admin/edit-user.client.view.html',
        controller: 'UserController',
        resolve: {
          userResolve: ['$stateParams', 'Admin', function ($stateParams, Admin) {
            return Admin.get({
              userId: $stateParams.userId
            });
          }]
        }
      })
      .state('admin.create-project', {
        url: '/projects/create',
        templateUrl: 'modules/users/client/views/admin/create-project.client.view.html',
        controller: 'CreateProjectController',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('admin.project', {
        url: '/projects/:projectId',
        templateUrl: 'modules/users/client/views/admin/view-project.client.view.html',
        controller: 'CreateProjectController',
        data: {
          roles: ['user', 'admin']
        }
      });

      /*  TODO: add states using:
            .state('STATE NAME (admin.WHATEVER-WITH-DASHES)', {
              url: '/PATH/IN/URL',
              templateUrl: 'modules/users/client/views/admin/HTML-FOR-THIS-STATE',
              controller: 'CONTROLLER NAME (not file)',
              resolve: {      // copy all this as is. Don't cahnge any of it
                userResolve: ['$stateParams', 'Admin', function ($stateParams, Admin) {
                  return Admin.get({
                    userId: $stateParams.userId
                  });
                }]
              }
            });
      */
  }
]);
