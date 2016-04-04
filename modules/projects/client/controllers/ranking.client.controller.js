'use strict';

angular.module('projects').controller('RankingController', ['$scope',
  function ($scope) {
    $scope.sortType = 'posterRating';
    $scope.sortType2 = '-posterRating';

    $scope.instructionTexts = ['Rank your favorite 3 posters, then hit Next!',
                                'Rank your favorite 3 presentations, then hit Next!',
                                'Rank your favorite 3 demonstrations, then hit Submit to save your rankings!'
                              ];
    
    $scope.buttons = [document.querySelector('#posterButton'),      
                      document.querySelector('#presButton'), 
                      document.querySelector('#demoButton') ];
    document.querySelector('#posterButton').classList.add('accentColor');
    document.querySelector('#posterButton').style.color = '#fff';

    $scope.sortByPoster = function () {
      $scope.sortType = 'posterRating';
      $scope.sortType2 = '-posterRating';
    };

    $scope.sortByDemo = function () {
      $scope.sortType = 'demoRating';
      $scope.sortType2 = '-demoRating';
    };

    $scope.sortByPresentation = function () {
      $scope.sortType = 'presentationRating';
      $scope.sortType2 = '-presentationRating';
    };

    $scope.broadcastSortTypes = function () {
      $scope.$emit('sort', [$scope.sortType, $scope.sortType2]);
    };

    $scope.sortFunctions = [$scope.sortByPoster,
                             $scope.sortByPresentation,
                             $scope.sortByDemo];

    $scope.currentInstruction = $scope.instructionTexts[0];

    $scope.currentStep = 0;
    $scope.nextButtonPressed = function () {
      if ($scope.currentStep < 2) {
        $scope.filterButtonPressed($scope.currentStep + 1);
      } else {
        $scope.$emit('submitRankings');
      }
    };

    $scope.filterButtonPressed = function (index) {
      $scope.currentStep = index;
      $scope.sortFunctions[index]();
      $scope.broadcastSortTypes();
      $scope.currentInstruction = $scope.instructionTexts[index];
      
      for (var i = 0; i < $scope.buttons.length; ++i) {
        if (i === index) {
          $scope.buttons[i].classList.add('accentColor');
          $scope.buttons[i].style.color = '#fff';
        } else {
          $scope.buttons[i].classList.remove('accentColor');
          $scope.buttons[i].style.color = '#000';
        }
      }

      if (index < 2) {
        document.getElementById('nextButton').textContent = 'Next';
      } else {
        document.getElementById('nextButton').textContent = 'Submit Rankings';
      }
    };
  }
]);