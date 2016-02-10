'use strict';

angular.module('users.admin').controller('CreateProjectController', ['$scope', '$stateParams', '$location', 'Authentication', 'projects',
  function ($scope, $stateParams, $location, Authentication, Project) {
    $scope.authentication = Authentication;
    //$scope.user = userResolve;

    $scope.create = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'createProjectForm');

        return false;
      }

      // Create new project object
      var project = new Project({
        teamName: this.teamName,
        description: this.description
        //,logo: this.logo
      });

      // Redirect after save
      project.$save(function (response) {
        $location.path('admin/projects/' + response._id);

        // Clear form fields
        $scope.teamName = '';
        $scope.description = '';
        //$scope.logo = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
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
          $location.path('admin/projects');
        });
      }
    };

    // Update existing project
    $scope.update = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'createProjectForm');

        return false;
      }

      var project = $scope.project;

      project.$update(function () {
        $location.path('admin/projects/' + project._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of projects
    $scope.find = function () {
      $scope.projects = Project.query();
    };

    // Find existing project
    /*
    $scope.findOne = function () {
      $scope.project = Project.get({
        projectId: $stateParams.projectId
      });
    };
    */
  }
]);
