'use strict';

/**
 * Module dependencies.
 */
var projectsPolicy = require('../policies/projects.server.policy'),
  projects = require('../controllers/projects.server.controller');

module.exports = function (app) {
  // Ratings collection routes
  app.route('/api/projects').all(projectsPolicy.isAllowed)
    .get(projects.list)
    .post(projectsPolicy.isAllowed, projects.create);
    
  app.route('/api/projects/create').all(projectsPolicy.isAllowed)
    .post(projectsPolicy.isAllowed, projects.create);

  // Single rating routes
  app.route('/api/projects/:projectId').all(projectsPolicy.isAllowed)
    .get(projects.read)
    .put(projects.update)
    .delete(projects.delete);

  // Rank projects routes
  app.route('/api/projects/rank').all(projectsPolicy.isAllowed)
    .get(projects.read)
    .put(projects.update)
    .delete(projects.delete);

  // Finish by binding the rating middleware
  app.param('projectId', projects.projectByID);
};
