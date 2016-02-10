'use strict';

// Configuring the Articles module
angular.module('users.admin').run(['Menus',
  function (Menus) {
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Manage Users',
      state: 'admin.users'
    });
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Create Project',
      state: 'admin.create-project'
    });
  }
]);
