'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Rating = mongoose.model('Rating'),
  Project = mongoose.model('Project');

/**
 * Globals
 */
var user, rating, project;

/**
 * Unit tests
 */
describe('Rating Model Unit Tests:', function () {
  beforeEach(function (done) {
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    });

    project = new Project({
      teamName: 'Project Title',
      description: 'Project Description',
      logo: 'test.png'
    });

    user.save(function () {
      rating = new Rating({
        isJudge: false,
        project: project,
        user: user,
        posterRating: 5,
        presentationRating: 3,
        demoRating: 4
      });
    });

    project.save(function (err) {
      should.not.exist(err);
    });

    done();
  });

  describe('Method Save', function () {
    it('should be able to save without problems', function (done) {
      this.timeout(10000);

      return rating.save(function (err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without project', function (done) {
      rating.project = '';

      return rating.save(function (err) {
        should.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without user', function (done) {
      rating.user = '';

      return rating.save(function (err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function (done) {
    Rating.remove().exec(function () {
      User.remove().exec(function () {
        Project.remove().exec(done);
      });
    });
  });

});
