'use strict';

/**
 * Module dependencies.
 */
var adminPolicy = require('../policies/admin.server.policy'),
  admin = require('../controllers/admin.server.controller'),
  project = require('../controllers/projects.server.controller'),
  rating= require('../../../ratings/server/controllers/ratings.server.controller');

module.exports = function (app) {
  // User route registration first. Ref: #713
  require('./users.server.routes.js')(app);

  // Users collection routes
  app.route('/api/users')
    .get(adminPolicy.isAllowed, admin.listUser);

  // Single user routes
  app.route('/api/users/:userId')
    .get(adminPolicy.isAllowed, admin.readUser)
    .put(adminPolicy.isAllowed, admin.updateUser)
    .delete(adminPolicy.isAllowed, admin.deleteUser);

  app.route('/api/projects')
    .get(adminPolicy.isAllowed, project.list);

  // Create project route
  app.route('/api/projects/create')
    .get(adminPolicy.isAllowed, project.list)
    .post(project.create);

  app.route('/api/projects/:projectId')
        // temporary test to see if project.projectById is the problem
    .get(adminPolicy.isAllowed, project.projectByID)
    .put(adminPolicy.isAllowed, project.update)
    .delete(adminPolicy.isAllowed, project.delete);

  /* TODO: add routes as follows:
        app.route('/api/LOGICAL/PATH')
          .get(adminPolicy.isAllowed, ADMIN/PROJECT/RATING.FUNCTION)
          .put(adminPolicy.isAllowed, ADMIN/PROJECT/RATING.FUNCTION);
  */

  // Finish by binding the user middleware
  app.param('userId', admin.userByID);
  app.param('projectId', project.projectByID);
};
