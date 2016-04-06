'use strict';

// TODO: determine how to populate database with projects for testing
/*require('modules/users/server/models/user.server.model.js');
var mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Project = mongoose.model('Project'),
  Rating = mongoose.model('Rating');

var initRatings = function() {
  var project1 = new Project({
    teamName: 'DJ Khaled',
    description: '#BlessUp',
    logo: 'default.jpg'
  });

  var project2 = new Project({
    teamName: 'Ermm',
    description: 'Seriously running out of ideas..',
    logo: 'Ayyyy.jpg'
  });

  project1.save();

  project2.save();
};*/

describe('Ratings E2E Tests:', function () {
  //initRatings();

  describe('Test ratings page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/ratings');
      expect(element.all(by.repeater('rating in ratings')).count()).toEqual(0);
    });
  });
});
