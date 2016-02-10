'use strict';

/**
 * Module dependencies.
 */
var adminPolicy = require('../policies/admin.server.policy'),
  admin = require('../controllers/admin.server.controller'),
  project = require('../../../ratings/server/controllers/projects.server.controller'),
  rating= require('../../../ratings/server/controllers/ratings.server.controller');

module.exports = function (app) {
  // User route registration first. Ref: #713
  require('./users.server.routes.js')(app);

  // Users collection routes
  app.route('/api/users')
    .get(adminPolicy.isAllowed, admin.list);

  // Single user routes
  app.route('/api/users/:userId')
    .get(adminPolicy.isAllowed, admin.read)
    .put(adminPolicy.isAllowed, admin.update)
    .delete(adminPolicy.isAllowed, admin.delete);

  // Create project route
  app.route('/api/projects/create')
    .get(adminPolicy.isAllowed, project.list)
    .put(adminPolicy.isAllowed, project.create);

  /* TODO: add routes as follows:
        app.route('/api/LOGICAL/PATH')
          .get(adminPolicy.isAllowed, ADMIN/PROJECT/RATING.FUNCTION)
          .put(adminPolicy.isAllowed, ADMIN/PROJECT/RATING.FUNCTION);
  */

  // Finish by binding the user middleware
  app.param('userId', admin.userByID);
};
