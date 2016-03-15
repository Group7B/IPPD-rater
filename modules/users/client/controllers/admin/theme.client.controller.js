'use strict';

angular.module('users.admin').controller('ThemeController', ['$scope', 'Theme',
  function ($scope, Theme) {
    console.log(document.styleSheets);

    $scope.addCSSRule = function (sheet, selector, rules, index) {
      sheet.deleteRule(index);
      if ('insertRule' in sheet) {
        sheet.insertRule(selector + '{' + rules + '}', index);
      } else if ('addRule' in sheet) {
        sheet.addRule(selector, rules, index);
      }
    };

    $scope.updateDatabase = function () {
      Theme.get(function (data) {
        var theme = data;
        
        if ($scope.backgroundColor) {
          theme.backgroundColor = $scope.backgroundColor;
        }

        if ($scope.accentColor) {
          theme.accentColor = $scope.accentColor;
        }

        if ($scope.textColor) {
          theme.textColor = $scope.textColor;
        }

        theme.$update(function () {
          console.log('theme updated');
        }, function (errorResponse) {
          $scope.error = errorResponse.data.message;
        });
      });
    };

    $scope.updateStoredColors = function () {
      if ($scope.backgroundColor) {
        $scope.addCSSRule(document.styleSheets[5], '.backgroundColor', 'background-color: ' + $scope.backgroundColor, 0);
      }
      
      if ($scope.accentColor) {
        $scope.addCSSRule(document.styleSheets[5], '.accentColor', 'background-color: ' + $scope.accentColor, 1);
      }
      
      if ($scope.textColor) {
        $scope.addCSSRule(document.styleSheets[5], '.textColor', 'color: ' + $scope.textColor, 2);
      }

      $scope.updateDatabase();
    };

    $scope.clearFields = function () {
      $scope.backgroundColor = null;
      $scope.accentColor = null;
      $scope.textColor = null;
    };
  }
]);