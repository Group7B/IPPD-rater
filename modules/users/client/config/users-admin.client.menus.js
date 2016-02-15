'use strict';

// Configuring the Articles module
angular.module('users.admin').run(['Menus',
  function (Menus) {
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Manage Users',
      state: 'admin.users',
      roles: ['admin']
    });
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Create Project',
      state: 'admin.create-project',
      roles: ['admin']
    });
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Manage Projects',
      state: 'admin.projects',
      roles: ['admin']
    });

    /* TODO: add any other menu items with:
        Menus.addSubMenuItem('topbar', 'admin', {
          title: 'WORDS THAT WILL GO IN DROPDOWN ELEMENT',
          state: 'STATE NAME (see user-admin.client.routes.js)'
        });
    */
  }
]);
