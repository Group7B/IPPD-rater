'use strict';

angular.module('users.admin').controller('AdminProjectController', ['$scope', '$filter', '$stateParams', '$location', 'Authentication', 'Projects',
  function ($scope, $filter, $stateParams, $location, Authentication, Projects) {
    $scope.authentication = Authentication;

    $scope.create = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'projectForm');
        return false;
      }

      // Create new project object
      var project = new Projects({
        teamName: this.name,
        description: this.description
        //,logo: this.logo
      });


      // Redirect after save
      project.$save(function (response) {
        console.log ('Adding ' + project.teamName + ', ' + project.description);
        $location.path('admin/projects/' + response._id);
        //$location.path('admin/projects/create');

        // Clear form fields
        $scope.name = '';
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
          $location.path('admin/projects/list');
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
      console.log("The project is " + project.teamName);

      project.$update(function () {
        $location.path('admin/projects/' + project._id);
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
      });
    };
  }
]);
