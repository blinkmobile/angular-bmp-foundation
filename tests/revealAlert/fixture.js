/*jslint indent:2, browser:true*/
/*globals $, angular*/ // subject of test

var app = angular.module('app', ['bmp.foundation']);

app.controller('MainCtrl', [
  '$scope',
  function ($scope) {
    'use strict';

    $scope.alert = function () {
      $scope.alertWithReveal({
        title: 'Title!',
        lead: 'Lead paragraph!',
        body: 'Body paragraph!'
      }, function () {
        $scope.output = 'alerted!';
      });
    };
  }
]);
