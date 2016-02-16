'use strict';

// Setting up route
angular.module('ratings').config(['$stateProvider',
  function ($stateProvider) {
    // Ratings state routing
    $stateProvider
      .state('ratings', {
        abstract: true,
        url: '/ratings',
        template: '<ui-view/>'
      })
      .state('ratings.list', {
        url: '',
        templateUrl: 'modules/ratings/client/views/list-rating.client.view.html'
      })
      .state('ratings.create', {
        url: '/create',
        templateUrl: 'modules/ratings/client/views/create-rating.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('ratings.view', {
        url: '/:ratingId',
        templateUrl: 'modules/ratings/client/views/view-rating.client.view.html'
      })
      .state('ratings.edit', {
        url: '/:ratingId/edit',
        templateUrl: 'modules/ratings/client/views/edit-rating.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      });
  }
]);
