'use strict';

/**
 * Module dependencies.
 */
var ratingsPolicy = require('../policies/ratings.server.policy'),
  ratings = require('../controllers/ratings.server.controller');

module.exports = function (app) {
  // Ratings collection routes
  app.route('/api/ratings').all(ratingsPolicy.isAllowed)
    .get(ratings.list)
    .post(ratings.create);

  // Single rating routes
  app.route('/api/ratings/:ratingId').all(ratingsPolicy.isAllowed)
    .get(ratings.read)
    .put(ratings.update)
    .delete(ratings.delete);

  // Finish by binding the rating middleware
  app.param('ratingId', ratings.ratingByID);
};
