'use strict';

(function () {
  // Projects Controller Spec
  describe('Projects Service Tests', function () {

    var mockResource, RatingsObj;
    beforeEach(function(){
      module(function($provide){
        $provide.service('$resource', function(){
          this.alert= jasmine.createSpy('alert');
        });
      });
      module('ratings');
    });

    beforeEach(inject(function($resource, Ratings){
      mockResource=$resource;
      RatingsObj=Ratings;
    }));

    it('should do a thing', function () {
      var one = 1;
      expect(one).toEqual(1);
    });
        // NOTE: this was copied from the interweb and doesn't make sense
    // http://www.sitepoint.com/unit-testing-angularjs-services-controllers-providers/?utm_source=sitepoint&utm_medium=relatedsidebar&utm_term=javascript

    /*it('should show alert when title is not passed into showDialog', function(){
      var message="Some message";
      sampleSvcObj.showDialog(message);

      expect(mockWindow.alert).toHaveBeenCalledWith(message);
      expect(mockModalSvc.showModalDialog).not.toHaveBeenCalled();
    });

    it('should show modal when title is passed into showDialog', function(){
      var message="Some message";
      var title="Some title";
      sampleSvcObj.showDialog(message, title);

      expect(mockModalSvc.showModalDialog).toHaveBeenCalledWith({
        message: message,
        title: title
      });
      expect(mockWindow.alert).not.toHaveBeenCalled();
    });*/
  });
}());
