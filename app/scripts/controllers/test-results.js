'use strict';

(function () {

  /* @ngInject */
  function TestResultsController($scope) {
    $scope.$emit('we are using controllerAs syntax, scope is used only for events and watches');

    this.awesomeThings = [
      'Bower',
      'Grunt',
      'Haml',
      'Compass',
      'AngularJS',
      'Karma'
    ];
  }

  angular
    .module('postplayTryAppInternal')
    .controller('TestResultsController', TestResultsController);

})();
