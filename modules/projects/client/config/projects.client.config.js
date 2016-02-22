'use strict';

// Configuring the ratings module
angular.module('projects').run(['Menus',
  function (Menus) {
    // Add the ratings dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Projects',
      state: 'projects',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'projects', {
      title: 'List Projects',
      state: 'projects.list'
    });

  }
]);
