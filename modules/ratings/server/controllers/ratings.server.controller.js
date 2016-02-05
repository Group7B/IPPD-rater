'use strict';

/* Need to update this to represent new schema */

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Rating = mongoose.model('Rating'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a rating
 */
exports.create = function (req, res) {
  var rating = new Rating(req.body);
  rating.user = req.user;
  rating.project = req.body.project;
  if (req.body.posterRating) rating.posterRating = req.body.posterRating;
  if (req.body.presentationRating) rating.presentationRating = req.body.presentationRating;
  if (req.body.demoRating) rating.demoRating = req.body.demoRating;

  rating.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(rating);
    }
  });
};

/**
 * Show the current rating
 */
exports.read = function (req, res) {
  res.json(req.rating);
};

/**
 * Update a rating
 */
exports.update = function (req, res) {
  var rating = req.rating;

  rating.user = req.user;
  rating.project = req.body.project;
  if (req.body.posterRating) rating.posterRating = req.body.posterRating;
  if (req.body.presentationRating) rating.presentationRating = req.body.presentationRating;
  if (req.body.demoRating) rating.demoRating = req.body.demoRating;

  rating.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(rating);
    }
  });
};

/**
 * Delete an rating
 */
exports.delete = function (req, res) {
  var rating = req.rating;

  rating.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(rating);
    }
  });
};

/**
 * List of Ratings
 */
exports.list = function (req, res) {
  Rating.find().sort('-created').populate('user', 'displayName').exec(function (err, ratings) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(ratings);
    }
  });
};

/**
 * Rating middleware
 */
exports.ratingByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Rating is invalid'
    });
  }

  Rating.findById(id).populate('user', 'displayName').exec(function (err, rating) {
    if (err) {
      return next(err);
    } else if (!rating) {
      return res.status(404).send({
        message: 'No rating with that identifier has been found'
      });
    }
    req.rating = rating;
    next();
  });
};
