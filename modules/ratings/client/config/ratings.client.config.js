'use strict';

// Configuring the ratings module
angular.module('ratings').run(['Menus',
  function (Menus) {
    // Add the ratings dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Ratings',
      state: 'ratings',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'ratings', {
      title: 'List Ratings',
      state: 'ratings.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'ratings', {
      title: 'Create Ratings',
      state: 'ratings.create',
      roles: ['user']
    });
  }
]);
