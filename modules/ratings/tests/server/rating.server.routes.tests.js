'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Rating = mongoose.model('Rating'),
  Project = mongoose.model('Project'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, judgeCredentials, user, judge, rating, project;

/**
 * Rating routes tests
 */
describe('Rating CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    judgeCredentials = {
      username: 'imJudgingYou',
      password: 'I\'mJudgingYou'
    };

    // Create a project to rate
    project = new Project({
      teamName: 'Project Title',
      description: 'Project Description',
      logo: 'test.png'
    });

    project.save(function (err) {
      should.not.exist(err);
    });

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new rating
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

    judge = new User({
      firstName: 'Judge',
      lastName: 'Judy',
      displayName: 'Judge Judy',
      email: 'Judge@Judy.com',
      username: judgeCredentials.username,
      password: judgeCredentials.password,
      provider: 'local',
      isJudge: true
    });

    judge.save(function () {
      rating = new Rating({
        isJudge: true,
        project: project,
        user: user,
        posterRating: 5,
        presentationRating: 3,
        demoRating: 4
      });
      done();
    });
  });


  it('should be able to save a rating if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new rating
        agent.post('/api/ratings')
          .send(rating)
          .expect(200)
          .end(function (ratingSaveErr, ratingSaveRes) {
            // Handle rating save error
            if (ratingSaveErr) {
              return done(ratingSaveErr);
            }

            // Get a list of ratings
            agent.get('/api/ratings')
              .end(function (ratingsGetErr, ratingsGetRes) {
                // Handle rating save error
                if (ratingsGetErr) {
                  return done(ratingsGetErr);
                }

                // Get ratings list
                var ratings = ratingsGetRes.body;

                // Set assertions
                (ratings[0].user._id).should.equal(userId);
                (ratings[0].isJudge).should.equal(false);
                (ratings[0].project._id).should.equal(project.id);
                (ratings[0].posterRating).should.equal(5);
                (ratings[0].presentationRating).should.equal(3);
                (ratings[0].demoRating).should.equal(4);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save a rating if not logged in', function (done) {
    agent.post('/api/ratings')
      .send(rating)
      .expect(403)
      .end(function (ratingSaveErr, ratingSaveRes) {
        // Call the assertion callback
        done(ratingSaveErr);
      });
  });

  it('should not be able to save a rating if no project is specified', function (done) {
    // Invalidate title field
    rating.project = null;

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;
        rating.project = null;

        // Save a new rating
        agent.post('/api/ratings')
          .send(rating)
          .expect(400)
          .end(function (ratingSaveErr, ratingSaveRes) {
            if (ratingSaveErr) {
              return done(ratingSaveErr);
            }
            // Set message assertion
            (ratingSaveRes.body.message).should.match('All ratings must relate to a project');
            // Handle rating save error
            done(ratingSaveErr);
          });
      });
  });

    // TODO: currently getting a 403 "Forbidden"
  it('should be able to update a rating if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new rating
        agent.post('/api/ratings')
          .send(rating)
          .expect(200)
          .end(function (ratingSaveErr, ratingSaveRes) {
            // Handle rating save error
            if (ratingSaveErr) {
              return done(ratingSaveErr);
            }

            // Update rating title
            rating.posterRating = 1;
            rating.presentationRating = 1;
            rating.demoRating = 2;

            // Update an existing rating
            agent.put('/api/ratings/' + ratingSaveRes.body._id)
              .send(rating)
              .expect(200)
              .end(function (ratingUpdateErr, ratingUpdateRes) {
                // Handle rating update error
                if (ratingUpdateErr) {
                  return done(ratingUpdateErr);
                }
                console.log(ratingUpdateRes.body);
                // Set assertions
                (ratingUpdateRes.body._id).should.equal(ratingSaveRes.body._id);
                (ratingUpdateRes.body.user).should.equal(userId);
                (ratingUpdateRes.body.isJudge).should.equal(false);
                (ratingUpdateRes.body.project).should.equal(project.id);
                (ratingUpdateRes.body.posterRating).should.equal(1);
                (ratingUpdateRes.body.presentationRating).should.equal(1);
                (ratingUpdateRes.body.demoRating).should.equal(2);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to get a list of ratings if not signed in', function (done) {
    // Create new rating model instance
    var ratingObj = new Rating(rating);

    // Save the rating
    ratingObj.save(function () {
      // Request ratings
      request(app).get('/api/ratings')
        .expect(403)
        .end(function (req, res) {
          // Call the assertion callback
          done();
        });

    });
  });

  it('should not be able to get a single rating if not signed in', function (done) {
    // Create new rating model instance
    var ratingObj = new Rating(rating);

    // Save the rating
    ratingObj.save(function () {
      request(app).get('/api/ratings/' + ratingObj._id)
        .expect(403)
        .end(function (req, res) {
          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single rating with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/ratings/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Rating is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single rating which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent rating
    request(app).get('/api/ratings/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No rating with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

    // TODO: currently getting a 403 "Forbidden"
  it('should be able to delete a rating if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new rating
        agent.post('/api/ratings')
          .send(rating)
          .expect(200)
          .end(function (ratingSaveErr, ratingSaveRes) {
            // Handle rating save error
            if (ratingSaveErr) {
              return done(ratingSaveErr);
            }

            // Delete an existing rating
            agent.delete('/api/ratings/' + ratingSaveRes.body._id)
              .send(rating)
              .expect(200)
              .end(function (ratingDeleteErr, ratingDeleteRes) {
                // Handle rating error error
                if (ratingDeleteErr) {
                  return done(ratingDeleteErr);
                }

                // Set assertions
                (ratingDeleteRes.body._id).should.equal(ratingSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete a rating if not signed in', function (done) {
    // Set rating user
    rating.user = user;

    // Create new rating model instance
    var ratingObj = new Rating(rating);

    // Save the rating
    ratingObj.save(function () {
      // Try deleting rating
      request(app).delete('/api/ratings/' + ratingObj._id)
        .expect(403)
        .end(function (ratingDeleteErr, ratingDeleteRes) {
          // Set message assertion
          (ratingDeleteRes.body.message).should.match('User is not authorized');

          // Handle rating error error
          done(ratingDeleteErr);
        });

    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Project.remove().exec(function () {
        Rating.remove().exec(done);
      });
    });
  });
});
