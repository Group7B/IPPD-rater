'use strict';

angular.module('projects').controller('ProjectController', ['$scope', '$filter', '$stateParams', '$location', 'Authentication', 'Projects', 'Ratings', 'sharedLogoUrl',
  function ($scope, $filter, $stateParams, $location, Authentication, Projects, Ratings, sharedLogoUrl) {
    $scope.authentication = Authentication;
    $scope.projectFilter = 'all';

    $scope.create = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'projectForm');
        return false;
      }

      // Create new project object
      var project = new Projects({
        teamName: this.name,
        description: this.description,
        logo: $scope.buildLogoName(this.name)
      });

      sharedLogoUrl.setProperty($scope.buildLogoName(this.name));
      $scope.$broadcast('projectCreated');

      // Redirect after save
      project.$save(function (response) {
        $location.path('admin/projects/listadmin');

        // Clear form fields
        $scope.name = '';
        $scope.description = '';
        $scope.logo = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    $scope.buildLogoName = function (name) {
      name = name.replace(/\s+/g, '');
      name += '.jpg';

      return name;
    };

    // Remove existing project
    $scope.remove = function (project) {
      if (project) {
        project.$remove();

        for (var i in $scope.projects) {
          if ($scope.projects[i] === project) {
            $scope.projects.splice(i, 1);
          }
        }
      } else {
        $scope.project.$remove(function () {
          $location.path('admin/projects/listadmin');
        });
      }
    };

    // Update existing project
    $scope.update = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'projectForm');
        return false;
      }

      var project = $scope.project;
      if ($scope.teamName) project.teamName = $scope.teamName;
      if ($scope.description) project.description = $scope.description;
      $scope.$broadcast('projectCreated');

      project.$update(function () {
        $location.path('admin/projects/listadmin');
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of projects
    $scope.find = function () {
      Projects.query(function (data) {
        $scope.projects = data;
        $scope.buildPager();
      });
      $scope.ratings = {};
      Ratings.query(function (data) {
        $scope.ratings = data;
      });
    };

    $scope.buildPager = function () {
      $scope.pagedItems = [];
      $scope.itemsPerPage = 15;
      $scope.currentPage = 1;
      $scope.figureOutItemsToDisplay();
    };

    $scope.figureOutItemsToDisplay = function () {
      $scope.filteredItems = $filter('filter')($scope.projects, {
        $: $scope.search
      });
      $scope.filterLength = $scope.filteredItems.length;
      var begin = (($scope.currentPage - 1) * $scope.itemsPerPage);
      var end = begin + $scope.itemsPerPage;
      $scope.pagedItems = $scope.filteredItems.slice(begin, end);
    };

    $scope.pageChanged = function () {
      $scope.figureOutItemsToDisplay();
    };

    // Find existing project
    $scope.findOne = function () {
      $scope.project = Projects.get({
        projectId: $stateParams.projectId
      }, function () {
        sharedLogoUrl.setProperty($scope.project.logo);
      });
      var projectId = $stateParams.projectId;
    };
    // find existing project by passed in value
    $scope.findById = function (projectId) {
      $scope.project = Projects.get({
        projectId: projectId
      });
    };

    $scope.userIsAdmin = function () {
      var roles = $scope.authentication.user.roles;
      for (var i = 0; i < roles.length; ++i) {
        if (roles[i] === 'admin') {
          return true;
        }
      }
      return false;
    };

    $scope.deleteAllProjects = function () {
      //warning message
      if (confirm("Do you want to delete all projects from the database?")) {
        $scope.thisProject = {};
        Projects.query(function (data) {
          $scope.projects = data;
        });
        var i;
        for (i = 0; i < $scope.projects.length; i++) {
          $scope.projects[i].$remove(); //delete all ratings
        }
        $scope.projects.splice(0, $scope.projects.length);
        alert('All projects successfully deleted!');
      }
    };

    $scope.hasRated = function (project) {
      var filtered = $filter('filter')(
        $scope.ratings, {
          project: {
            _id: project._id
          },
          user: {
            _id: $scope.authentication.user._id
          }
        });
      if (filtered.length > 0) {
        var index = $scope.projects.indexOf(project);
        $scope.projects.splice(index, 1);
        $scope.projects.push(project);
        return 'Rated';
      } else {
        return 'Unrated';
      }
    };

    $scope.testFilter = function (projectFilter) {
      if ($scope.projectFilter === projectFilter)
        $scope.projectFilter = 'all';
      else
        $scope.projectFilter = projectFilter;
    };


  }
]);
