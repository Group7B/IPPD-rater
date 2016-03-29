'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var ProjectSchema = new Schema({
  teamName: {
    type: String,
    required: [true,'Project Title is required'],
    unique: [true, 'A Project with that name already exists']
  },
  description: {
    type: String
  },
  logo: {
    type: String
  }
});

mongoose.model('Project', ProjectSchema);
