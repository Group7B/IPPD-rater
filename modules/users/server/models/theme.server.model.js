'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Rating Schema
 */
var ThemeSchema = new Schema({
  ID: {
    type: String,
    default: '0'
  },
  backgroundColor: {
    type: String,
    default: '#fff'
  },
  accentColor: {
    type: String,
    default: '#005596'
  },
  textColor: {
    type: String,
    default: '#000'
  }
});

mongoose.model('Theme', ThemeSchema);