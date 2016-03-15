'use strict';

angular.module('users.admin').controller('ThemeController', ['$scope', 'Theme',
  function ($scope, Theme) {
    
    $scope.addCSSRule = function(sheet, selector, rules, index) {
      sheet.deleteRule(index);
      if('insertRule' in sheet) {
        sheet.insertRule(selector + '{' + rules + '}', index);
      } else if ('addRule' in sheet) {
        sheet.addRule(selector, rules, index);
      }
    };
    
    $scope.updateDatabase = function (backgroundColor, accentColor, textColor) {
      var theme = new Theme({
        ID: '0',
        backgroundColor: backgroundColor,
        accentColor: accentColor,
        textColor: textColor
      });
      
      theme.$update(function () {
        console.log('theme updated');
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
    
    $scope.updateStoredColors = function(backgroundColor, accentColor, textColor) {
      $scope.addCSSRule(document.styleSheets[4], '.backgroundColor', 'background-color: ' + backgroundColor, 0);
      $scope.addCSSRule(document.styleSheets[4], '.accentColor', 'background-color: ' + accentColor, 1);
      $scope.addCSSRule(document.styleSheets[4], '.textColor', 'color: ' + textColor, 2);
      
      $scope.updateDatabase(backgroundColor, accentColor, textColor);
    };
  }
]);