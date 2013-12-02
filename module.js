/*jslint browser:true, indent:2*/
/*globals define, require*/ // Require.JS
/*jslint nomen:true*/ // LoDash / Underscore.JS

define([
  'jquery',
  'lodash',
  'angular',
  'text!./partial.html',
  'foundation'
], function ($, _, ng, partial) {
  'use strict';

  var mod;

  mod = ng.module('bmp.foundation', []);

  mod.directive('bmpCloseReveal', [
    function () {
      return {
        replace: false,
        link: function ($scope, el$) {
          el$.on('click', function () {
            $scope.closeRevealModal();
          });
        }
      };
    }
  ]);

  mod.directive('bmpOpenReveal', [
    function () {
      return {
        replace: false,
        link: function ($scope, el$, attrs) {
          el$.on('click', function (event) {
            $scope.openRevealModal(attrs.bmpCloseReveal);
            return false;
          });
        }
      };
    }
  ]);

  mod.directive('reveal', [
    '$rootScope',
    function ($root) {
      $(document).on('closed', '.reveal-modal[data-reveal]', function () {
        var this$;
        this$ = $(this);
        $root.$broadcast('revealModalClosed', this$.attr('id'), this$);
      });
      return {
        replace: false,
        scope: true,
        link: function ($scope, el$) {
          var modal$;
          modal$ = $(el$[0]).closest('.reveal-modal[id]');
          $scope.closeRevealModal = function () {
            modal$.foundation('reveal', 'close');
          };
        }
      };
    }
  ]);

  mod.directive('bmpFoundation', [
    '$rootScope', '$timeout',
    function ($root, $timeout) {
      return {
        replace: false,
        link: function ($scope) {
          var confirmCallbacks, pokeFoundation;

          confirmCallbacks = {};

          pokeFoundation = function () {
            $timeout(function () {
              $root.$evalAsync(function () {
                $(document.body).foundation();
              });
            }, 0);
          };

          $scope.openRevealModal = function (id) {
            var modal$;
            modal$ = $('#' + id);
            modal$.foundation('reveal', 'open');
          };

          $scope.confirmWithReveal = function (options, callback) {
            options.asyncId = String(Math.random());
            confirmCallbacks[options.asyncId] = callback;
            $root.$broadcast('confirm', options);
            $scope.openRevealModal('confirm');
          };

          $scope.$on('confirmed', function ($event, id, result) {
            confirmCallbacks[id](result);
            delete confirmCallbacks[id];
          });

          $scope.$watch(_.throttle(pokeFoundation, 1e3, { leading: false }));
        }
      };
    }
  ]);

  mod.controller('ConfirmCtrl', [
    '$scope', '$rootScope',
    function ($scope, $root) {
      $scope.title = '';
      $scope.lead = '';
      $scope.body = '';
      $scope.asyncId = null;
      $scope.result = false;

      $scope.$on('confirm', function ($events, options) {
        $scope.title = options.title;
        $scope.lead = options.lead;
        $scope.body = options.body;
        $scope.asyncId = options.asyncId;
        $scope.result = false;
      });

      $scope.confirm = function () {
        $scope.result = true;
        $scope.closeRevealModal();
      };

      $scope.$on('revealModalClosed', function ($event, id) {
        if (id === 'confirm') {
          $root.$broadcast('confirmed', $scope.asyncId, $scope.result);
        }
      });
    }
  ]);

  $(document).ready(function () {
    $(document.body).append(partial);
  });

  return mod;
});
