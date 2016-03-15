'use strict';

var path = require('path'),
  mongoose = require('mongoose'),
  Theme = mongoose.model('Theme'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

exports.readTheme = function (req, res) {
  res.json(req.model);
};

exports.updateTheme = function (req, res) {
  var theme = req.model;

  theme.ID = req.body.ID;
  theme.backgroundColor = req.body.backgroundColor;
  theme.accentColor = req.body.accentColor;
  theme.textColor = req.body.textColor;

  theme.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

    res.json(theme);
  });
};