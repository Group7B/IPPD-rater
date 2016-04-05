'use strict';

/**
 * Module dependencies.
 */
var adminPolicy = require('../policies/admin.server.policy'),
  admin = require('../controllers/admin.server.controller'),
  project = require('../../../projects/server/controllers/projects.server.controller'),
  rating = require('../../../ratings/server/controllers/ratings.server.controller'),
  upload = require('../controllers/upload.server.controller'),
  theme = require('../controllers/theme.server.controller');

module.exports = function (app) {
  // User route registration first. Ref: #713
  require('./users.server.routes.js')(app);

  // Users collection routes
  app.route('/api/users')
    .get(adminPolicy.isAllowed, admin.listUser)
    .delete(adminPolicy.isAllowed, admin.deleteAllUsers);

  // Single user routes
  app.route('/api/users/:userId')
    .get(adminPolicy.isAllowed, admin.readUser)
    .put(adminPolicy.isAllowed, admin.updateUser)
    .delete(adminPolicy.isAllowed, admin.deleteUser);

  app.route('/api/upload')
    .post(upload.postImage);

  app.route('/api/upload/project')
    .post(upload.postProjectLogo);

  app.route('/api/export')
    .get(adminPolicy.isAllowed, upload.exportRatings);
  
  app.route('/api/theme')
    .get(theme.readTheme)
    .put(theme.updateTheme);

  /* TODO: add routes as follows:
        app.route('/api/LOGICAL/PATH')
          .get(adminPolicy.isAllowed, ADMIN/PROJECT/RATING.FUNCTION)
          .put(adminPolicy.isAllowed, ADMIN/PROJECT/RATING.FUNCTION);
  */

  // Finish by binding the user middleware
  app.param('userId', admin.userByID);
  app.param('projectId', project.projectByID);
};
