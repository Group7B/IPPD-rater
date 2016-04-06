'use strict';

// Setting up route
angular.module('projects').config(['$stateProvider',
  function ($stateProvider) {
        // Ratings state routing
    $stateProvider
      .state('projects', {
        abstract: true,
        url: '/projects',
        template: '<ui-view/>'
      })
      .state('projects.list', {
        url: '',
        templateUrl: 'modules/projects/client/views/list-project.client.view.html'
      })
      .state('projects.rate', {
        url: '/rate/:projectId',
        templateUrl: 'modules/ratings/client/views/single-rating.client.view.html',
        controller: 'ProjectController',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('projects.rank', {
        url: '/rank',
        templateUrl: 'modules/projects/client/views/rank-project.client.view.html',
        controller: 'ProjectController',
        data: {
          roles: ['judge','admin']
        }
      });
  }
]);
