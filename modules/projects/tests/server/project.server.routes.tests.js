'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Project = mongoose.model('Project'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, adminCredentials, user, admin, project;

/**
 * Project routes tests
 */
describe('Project CRUD tests', function () {

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

    adminCredentials = {
      username: 'adminUsername',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new admin
    admin = new User({
      firstName: 'Ad',
      lastName: 'Min',
      displayName: 'Ad Min',
      email: 'admin@test.com',
      username: adminCredentials.username,
      password: adminCredentials.password,
      provider: 'local',
      roles: ['admin', 'user']
    });

    // Save a user to the test db and create new project
    user.save(function () {
      project = {
        teamName: 'Super Duper Project',
        description: 'The best project never',
        logo: 'test.png'
      };
    });

    admin.save(function () {
      project = {
        teamName: 'Super Awesome Project',
        description: 'The best project never',
        logo: 'test.png'
      };
      done();
    });
  });

  it('should not be able to save a project if logged in as a user only', function (done) {
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

        // Save a new project
        agent.post('/api/projects')
          .send(project)
          .expect(403)
          .end(function (projectSaveErr, projectSaveRes) {
            // Call the assertion callback
            done(projectSaveErr);
          });
      });
  });

  it('should be able to save a project if logged in as an admin', function (done) {
    agent.post('/api/auth/signin')
      .send(adminCredentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }
        // Get the userId
        var userId = admin.id;
        // Save a new project
        agent.post('/api/projects')
          .send(project)
          .expect(200)
          .end(function (projectSaveErr, projectSaveRes) {
            // Handle project save error
            if (projectSaveErr) {
              return done(projectSaveErr);
            }
            // Get a list of projects
            agent.get('/api/projects')
              .end(function (projectsGetErr, projectsGetRes) {
                // Handle project save error
                if (projectsGetErr) {
                  return done(projectsGetErr);
                }

                // Get projects list
                var projects = projectsGetRes.body;

                // Set assertions
                (projects[0].teamName).should.match('Super Awesome Project');
                (projects[0].description).should.match('The best project never');
                (projects[0].logo).should.match('test.png');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save a project if not logged in', function (done) {
    agent.post('/api/projects')
      .send(project)
      .expect(403)
      .end(function (projectSaveErr, projectSaveRes) {
        // Call the assertion callback
        done(projectSaveErr);
      });
  });

  it('should not be able to save a project if no project name is provided', function (done) {
    // Invalidate title field
    project.teamName = '';

    agent.post('/api/auth/signin')
      .send(adminCredentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = admin.id;

        // Save a new project
        agent.post('/api/projects')
          .send(project)
          .expect(400)
          .end(function (projectSaveErr, projectSaveRes) {
            // Set message assertion
            (projectSaveRes.body.message).should.match('Project Title is required');

            // Handle project save error
            done(projectSaveErr);
          });
      });
  });

  it('should not be able to save a project if a project with the same name already exists', function (done) {
    agent.post('/api/auth/signin')
      .send(adminCredentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }
        // Get the userId
        var userId = admin.id;
        // Save a new project
        agent.post('/api/projects')
          .send(project)
          .expect(200)
          .end(function (projectSaveErr, projectSaveRes) {
            // catch errors
            if (projectSaveErr) {
              return done(projectSaveErr);
            }
            // Try to save another copy
            agent.post('/api/projects')
              .send(project)
              .expect(400)
              .end(function (projectSaveErr, projectSaveRes) {
                // Set message assertion
                (projectSaveRes.body.message).should.match('11000 duplicate key error collection: 27017.projects index: teamName already exists');
                // Handle project save error
                done(projectSaveErr);
              });
          });
      });
  });

  it('should be able to update a project if signed in as an admin', function (done) {
    agent.post('/api/auth/signin')
      .send(adminCredentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = admin.id;

        // Save a new project
        agent.post('/api/projects')
          .send(project)
          .expect(200)
          .end(function (projectSaveErr, projectSaveRes) {
            // Handle project save error
            if (projectSaveErr) {
              return done(projectSaveErr);
            }

            // Update project title
            project.teamName = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing project
            agent.put('/api/projects/' + projectSaveRes.body._id)
              .send(project)
              .expect(200)
              .end(function (projectUpdateErr, projectUpdateRes) {
                // Handle project update error
                if (projectUpdateErr) {
                  return done(projectUpdateErr);
                }

                // Set assertions
                (projectUpdateRes.body._id).should.equal(projectSaveRes.body._id);
                (projectUpdateRes.body.teamName).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of projects if not signed in', function (done) {
    // Create new project model instance
    var projectObj = new Project(project);

    // Save the project
    projectObj.save(function () {
      // Request projects
      request(app).get('/api/projects')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single project if not signed in', function (done) {
    // Create new project model instance
    var projectObj = new Project(project);

    // Save the project
    projectObj.save(function () {
      request(app).get('/api/projects/' + projectObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('teamName', project.teamName);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single project with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/projects/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Project is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single project which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent project
    request(app).get('/api/projects/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No project with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete a project if signed in as an admin', function (done) {
    agent.post('/api/auth/signin')
      .send(adminCredentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = admin.id;

        // Save a new project
        agent.post('/api/projects')
          .send(project)
          .expect(200)
          .end(function (projectSaveErr, projectSaveRes) {
            // Handle project save error
            if (projectSaveErr) {
              return done(projectSaveErr);
            }

            // Delete an existing project
            agent.delete('/api/projects/' + projectSaveRes.body._id)
              .send(project)
              .expect(200)
              .end(function (projectDeleteErr, projectDeleteRes) {
                // Handle project error error
                if (projectDeleteErr) {
                  return done(projectDeleteErr);
                }

                // Set assertions
                (projectDeleteRes.body._id).should.equal(projectSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete a project if signed in as a user only', function (done) {
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

        agent.post('/api/projects')
          .send(project)
          .expect(403)
          .end(function (projectDeleteErr, projectDeleteRes) {
            // Set message assertion
            (projectDeleteRes.body.message).should.match('User is not authorized');

            // Handle project error error
            done(projectDeleteErr);
          });
      });
  });

  it('should not be able to delete a project if not signed in', function (done) {
    // Set project user
    project.user = user;

    // Create new project model instance
    var projectObj = new Project(project);

    // Save the project
    projectObj.save(function () {
      // Try deleting project
      request(app).delete('/api/projects/' + projectObj._id)
        .expect(403)
        .end(function (projectDeleteErr, projectDeleteRes) {
          // Set message assertion
          (projectDeleteRes.body.message).should.match('User is not authorized');

          // Handle project error error
          done(projectDeleteErr);
        });

    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Project.remove().exec(done);
    });
  });
});
