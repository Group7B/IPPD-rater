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
  project: {
    type: Schema.ObjectId,
    ref: 'Project',
    required
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User',
    required
  },
  posterRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  presentationRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  demoRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
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
