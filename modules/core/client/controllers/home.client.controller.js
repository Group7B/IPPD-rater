'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication', 'Theme',
  function ($scope, Authentication, Theme) {
    // This provides Authentication context.
    $scope.authentication = Authentication;
    
    Theme.get(function (data) {
      var theme = data;
      $scope.updateStoredColors(theme.backgroundColor, theme.accentColor, theme.textColor);
    });
    
    $scope.addCSSRule = function(sheet, selector, rules, index) {
      sheet.deleteRule(index);
      if('insertRule' in sheet) {
        sheet.insertRule(selector + '{' + rules + '}', index);
      } else if ('addRule' in sheet) {
        sheet.addRule(selector, rules, index);
      }
    };
    
    $scope.updateStoredColors = function(backgroundColor, accentColor, textColor) {
      $scope.addCSSRule(document.styleSheets[6], '.backgroundColor', 'background-color: ' + backgroundColor, 0);
      $scope.addCSSRule(document.styleSheets[6], '.accentColor', 'background-color: ' + accentColor, 1);
      $scope.addCSSRule(document.styleSheets[6], '.textColor', 'color: ' + textColor, 2);
    };  
  }
]);
