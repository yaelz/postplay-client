'use strict';

(function () {

  /* @ngInject */
  function MainController($scope) {
    $scope.$emit('we are using controllerAs syntax, scope is used only for events and watches');
    $scope.chartObject = {
      type: 'LineChart',
      displayed: true,
      data: {
        cols: [
          {
            label: 'Run',
            type: 'string'
          },
          {
            label: 'Tested Server',
            type: 'number'
          },
          {
            label: 'Reference Server',
            type: 'number'
          },
          {
            label: 'Reference Server',
            type: 'number'
          },
          {
            label: 'Reference Server',
            type: 'number'
          }
        ],
        rows: [
          {
            "c": [
              {
                "v": "Run1"
              },
              {
                "v": 19,
                "f": "42 items"
              },
              {
                "v": 12,
                "f": "Ony 12 items"
              },
              {
                "v": 7,
                "f": "7 servers"
              },
              {
                "v": 4
              }
            ]
          },
          {
            "c": [
              {
                "v": "Run2"
              },
              {
                "v": 13
              },
              {
                "v": 1,
                "f": "1 unit (Out of stock this month)"
              },
              {
                "v": 12
              },
              {
                "v": 2
              }
            ]
          },
          {
            "c": [
              {
                "v": "Run3"
              },
              {
                "v": 24
              },
              {
                "v": 5
              },
              {
                "v": 11
              },
              {
                "v": 6
              }
            ]
          }
        ]
      },
      options: {
        title: 'Compare Runs for CHOSEN_ATTR',
        fill: 20,
        displayExactValues: true,
        explorer: {actions: ['dragToZoom', 'rightClickToReset']},
        vAxis: {
          title: 'Attr Values'
        },
        hAxis: {
          title: 'Runs'
        }
      },
      formatters: {}
    };
  }

  angular
    .module('postplayTryAppInternal')
    .controller('MainController', MainController);

})();
