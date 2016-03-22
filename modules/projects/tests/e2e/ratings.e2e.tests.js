'use strict';

describe('Ratings E2E Tests:', function () {
  describe('Test ratings page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/ratings');
      expect(element.all(by.repeater('rating in ratings')).count()).toEqual(0);
    });
  });
});
