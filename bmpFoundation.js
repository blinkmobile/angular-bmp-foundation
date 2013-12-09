/*jslint browser:true, indent:2*/
/*globals define, require*/ // Require.JS
/*jslint nomen:true*/ // LoDash / Underscore.JS

// https://github.com/umdjs/umd/blob/master/amdWeb.js
(function (root, factory) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
define([
  'jquery',
  'lodash',
  'angular',
  'text!partial.html',
  'foundation'
    ], factory);
  } else {
    factory(root.$, root._, root.angular);
  }
}(this, function ($, _, ng, partial) {
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
          el$.on('click', function () {
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
        $root.$broadcast('bmp.foundation.revealClosed', this$.attr('id'), this$);
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
    '$rootScope', '$timeout', '$compile',
    function ($root, $timeout, $compile) {

      if (partial) {
      $(document).ready(function () {
        var partial$;
        partial$ = $(partial);
        partial$.appendTo(document.body);
        $compile(partial$)($root);
      });
      }

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
            $root.$broadcast('bmp.foundation.confirm', options);
            $scope.openRevealModal('confirm');
          };

          /*jslint unparam:true*/ // $event
          $scope.$on('bmp.foundation.confirmed', function ($event, id, result) {
            confirmCallbacks[id](result);
            delete confirmCallbacks[id];
          });
          /*jslint unparam:false*/

          $scope.$watch(_.throttle(pokeFoundation, 1e3, { leading: false }));
        }
      };
    }
  ]);

  mod.controller('bmpFoundationConfirmCtrl', [
    '$scope', '$rootScope',
    function ($scope, $root) {
      $scope.title = '';
      $scope.lead = '';
      $scope.body = '';
      $scope.asyncId = null;
      $scope.result = false;

      /*jslint unparam:true*/ // $event
      $scope.$on('bmp.foundation.confirm', function ($event, options) {
        $scope.title = options.title;
        $scope.lead = options.lead;
        $scope.body = options.body;
        $scope.asyncId = options.asyncId;
        $scope.result = false;
      });
      /*jslint unparam:false*/

      $scope.confirm = function () {
        $scope.result = true;
        $scope.closeRevealModal();
      };

      /*jslint unparam:true*/ // $event
      $scope.$on('bmp.foundation.revealClosed', function ($event, id) {
        if (id === 'confirm') {
          $root.$broadcast('bmp.foundation.confirmed', $scope.asyncId, $scope.result);
        }
      });
      /*jslint unparam:false*/
    }
  ]);

  return mod;
}));
