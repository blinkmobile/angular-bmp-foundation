/*jslint indent:2, browser:true*/
/*globals $, angular*/ // subject of test

var app = angular.module('app', ['bmp.foundation']);

app.controller('MainCtrl', [
  '$scope',
  function ($scope) {
    'use strict';

    $scope.confirm = function () {
      $scope.confirmWithReveal({
        title: 'Title!',
        lead: 'Lead paragraph!',
        body: 'Body paragraph!'
      }, function (result) {
        if (result) {
          $scope.output = 'confirmed!';
        } else {
          $scope.output = 'cancelled!';
        }
      });
    };
  }
]);
