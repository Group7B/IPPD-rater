'use strict';

var path = require('path'),
  mongoose = require('mongoose'),
  Theme = mongoose.model('Theme'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

exports.readTheme = function (req, res) {
  Theme.findOne({}).exec(function (err, theme) {
    if (err) {
      return res.status(500).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else if (theme) {
      res.json(theme);
    } else {
      var defaultTheme = new Theme();
      defaultTheme.backgroundColor = '#FFFFFF';
      defaultTheme.accentColor = '#FF0000';
      defaultTheme.textColor = '#000000';
      defaultTheme.save(function (err) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        }

        res.json(defaultTheme);
      });
    }
  });
};

exports.updateTheme = function (req, res) {
  Theme
    .findOne({})
    .exec(function (err, theme) {
      if (err) {
        return res.status(500).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else if (theme) {
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
      } else {
        return res.status(404).send('No theme found!');
      }
    });
};