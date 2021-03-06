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
    required: true
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true
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
  },
  posterRank: {
    type: Number,
    default: 0
  },
  presentationRank: {
    type: Number,
    default: 0
  },
  demoRank: {
    type: Number,
    default: 0
  },
  comment: {
    type: String,
    default: ''
  }
});

mongoose.model('Rating', RatingSchema);
