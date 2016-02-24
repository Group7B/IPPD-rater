'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var ProjectSchema = new Schema({
  teamName: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String
  },
  logo: {
    type: String
  }
});

mongoose.model('Project', ProjectSchema);
