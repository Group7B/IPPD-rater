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
  }
  /* Not sure how to store logo yet
  ,
  logo: {
    type: ???
  }
  */
});

mongoose.model('Project', ProjectSchema);
