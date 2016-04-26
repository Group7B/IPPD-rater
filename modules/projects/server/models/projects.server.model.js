'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;
//This is the model for our mongoDB allowing us to store data in each _id
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
