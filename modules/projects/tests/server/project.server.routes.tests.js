'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Rating = mongoose.model('Rating'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, rating;

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
      rating = {
        title: 'Rating Title',
        content: 'Rating Content'
      };

      done();
    });
  });

  it('should be able to save an rating if logged in', function (done) {
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
                (ratings[0].title).should.match('Rating Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an rating if not logged in', function (done) {
    agent.post('/api/ratings')
      .send(rating)
      .expect(403)
      .end(function (ratingSaveErr, ratingSaveRes) {
        // Call the assertion callback
        done(ratingSaveErr);
      });
  });

  it('should not be able to save an rating if no title is provided', function (done) {
    // Invalidate title field
    rating.title = '';

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
          .expect(400)
          .end(function (ratingSaveErr, ratingSaveRes) {
            // Set message assertion
            (ratingSaveRes.body.message).should.match('Title cannot be blank');

            // Handle rating save error
            done(ratingSaveErr);
          });
      });
  });

  it('should be able to update an rating if signed in', function (done) {
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
            rating.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing rating
            agent.put('/api/ratings/' + ratingSaveRes.body._id)
              .send(rating)
              .expect(200)
              .end(function (ratingUpdateErr, ratingUpdateRes) {
                // Handle rating update error
                if (ratingUpdateErr) {
                  return done(ratingUpdateErr);
                }

                // Set assertions
                (ratingUpdateRes.body._id).should.equal(ratingSaveRes.body._id);
                (ratingUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of ratings if not signed in', function (done) {
    // Create new rating model instance
    var ratingObj = new Rating(rating);

    // Save the rating
    ratingObj.save(function () {
      // Request ratings
      request(app).get('/api/ratings')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single rating if not signed in', function (done) {
    // Create new rating model instance
    var ratingObj = new Rating(rating);

    // Save the rating
    ratingObj.save(function () {
      request(app).get('/api/ratings/' + ratingObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', rating.title);

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

  it('should be able to delete an rating if signed in', function (done) {
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

  it('should not be able to delete an rating if not signed in', function (done) {
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
      Rating.remove().exec(done);
    });
  });
});
