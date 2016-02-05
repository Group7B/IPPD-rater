'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Rating Schema
 */
var RatingSchema = new Schema({
  isJudge: {
    type: Boolean,
    default: false
  },
  projectId: {
    type: Schema.ObjectId,
    ref: 'Project'
  },
  userId: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  poster: {
    type: Number,
    default: 0
  },
  presentation: {
    type: Number,
    default: 0
  },
  demo: {
    type: Number,
    default: 0
  }
  /* Old things from Articles module:
  created: {
    type: Date,
    default: Date.now
  },
  title: {
    type: String,
    default: '',
    trim: true,
    required: 'Title cannot be blank'
  },
  content: {
    type: String,
    default: '',
    trim: true
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
  */
});

mongoose.model('Rating', RatingSchema);
