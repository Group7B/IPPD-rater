'use strict';

angular.module('users.admin').controller('ThemeController', ['$scope', 'Theme',
  function ($scope, Theme) {
    Theme.get(function (data) {
      $scope.theme = data;
    });

    $scope.addCSSRule = function (sheet, selector, rules, index) {
      sheet.deleteRule(index);
      if ('insertRule' in sheet) {
        sheet.insertRule(selector + '{' + rules + '}', index);
      } else if ('addRule' in sheet) {
        sheet.addRule(selector, rules, index);
      }
    };
//Updating any updated colors into the DB
    $scope.updateDatabase = function () {
      if ($scope.backgroundColor) {
        $scope.theme.backgroundColor = $scope.backgroundColor;
      }
        
      if ($scope.accentColor) {
        $scope.theme.accentColor = $scope.accentColor;
      }

      if ($scope.textColor) {
        $scope.theme.textColor = $scope.textColor;
      }

      $scope.theme.$update(function () {
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    $scope.updateStoredColors = function () {
      if ($scope.backgroundColor) {
        $scope.addCSSRule(document.styleSheets[6], '.backgroundColor', 'background-color: ' + $scope.backgroundColor, 0);
      }
      
      if ($scope.accentColor) {
        $scope.addCSSRule(document.styleSheets[6], '.accentColor', 'background-color: ' + $scope.accentColor, 1);
      }
      
      if ($scope.textColor) {
        $scope.addCSSRule(document.styleSheets[6], '.textColor', 'color: ' + $scope.textColor, 2);
      }

      $scope.updateDatabase();
    };
      //Return all fields to the default colors
    $scope.clearFields = function () {
      $scope.backgroundColor = null;
      $scope.accentColor = null;
      $scope.textColor = null;
    };
  }
]);