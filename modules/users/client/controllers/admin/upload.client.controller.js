'use strict';

angular.module('users.admin').controller('UploadController', ['$scope', '$timeout', 'FileUploader', 'sharedLogoUrl',
  function ($scope, $timeout, FileUploader, sharedLogoUrl) {
    
    var uploadingProject = false;
    $scope.invalidFile = false;

    $scope.uploader = new FileUploader({
      url: '',
      removeAfterUpload: true
    });

    $scope.initUploader = function (isProject) {
      if (isProject) {
        uploadingProject = true;
        $scope.uploader.url = 'api/upload/project';
      } else {
        uploadingProject = false;
        $scope.uploader.url = 'api/upload';
      }
    };

    $scope.uploader.filters.push({
      name: 'imageFilter',
      fn: function (item /*{File|FileLikeObject}*/ , options) {
        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
        return '|jpg|png|jpeg|'.indexOf(type) !== -1;
      }
    });
    
    $scope.uploader.filters.push({
      name: 'sizeFilter',
      fn: function (item /*{File|FileLikeObject}*/ , options) {
        return item.size < 5000000;
      }
    });
    
    $scope.$on('projectCreated', function () {
      if ($scope.uploader.getNotUploadedItems().length) {
        $scope.uploader.uploadAll();
      }
    });

    // CALLBACKS

    $scope.uploader.onWhenAddingFileFailed = function (item /*{File|FileLikeObject}*/ , filter, options) {
      $scope.invalidFile = true;
      
      if (filter.name === 'sizeFilter') {
        $scope.invalidFileMessage = 'Files must be less than 5MB.';
      } else {
        $scope.invalidFileMessage = 'Files must be of type .png or .jpg.';
      }
      
      $scope.invalidFileMessage += ' Please select another file.';
    };
    $scope.uploader.onAfterAddingFile = function (fileItem) {
      $scope.invalidFile = false;
      
      if (uploadingProject) {        
        fileItem.file.name = sharedLogoUrl.getProperty().logoUrl;
      }
    };
    $scope.uploader.onAfterAddingAll = function (addedFileItems) {
    };
    $scope.uploader.onBeforeUploadItem = function (fileItem) {
      if (uploadingProject) {        
        fileItem.file.name = sharedLogoUrl.getProperty().logoUrl;
      }
    };
    $scope.uploader.onProgressItem = function (fileItem, progress) {
    };
    $scope.uploader.onProgressAll = function (progress) {
    };
    $scope.uploader.onSuccessItem = function (fileItem, response, status, headers) {
    };
    $scope.uploader.onErrorItem = function (fileItem, response, status, headers) {
    };
    $scope.uploader.onCancelItem = function (fileItem, response, status, headers) {
    };
    $scope.uploader.onCompleteItem = function (fileItem, response, status, headers) {
    };
    $scope.uploader.onCompleteAll = function () {
      console.info('onCompleteAll');
    };
  }
]);