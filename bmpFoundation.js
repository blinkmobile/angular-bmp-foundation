/*jslint browser:true, indent:2*/
/*globals define, require*/ // Require.JS
/*jslint nomen:true*/ // LoDash / Underscore.JS
/*jqlint angular:true*/

// https://github.com/umdjs/umd/blob/master/amdWeb.js
(function (root, factory) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define([
      'jquery',
      'lodash',
      'angular',
      'text!bmpFoundation.html',
      'foundation'
    ], factory);
  } else {
    factory(root.$, root._, root.angular);
  }
}(this, function ($, _, ng, partial) {
  'use strict';

  var mod, isEntirelyVisible;

  isEntirelyVisible = function (el$) {
    var offset, elHeight, elWidth;
    offset = el$.offset();
    if (offset.top < 0 || offset.left < 0) {
      return false;
    }
    elHeight = el$.outerHeight();
    if (offset.top + elHeight > $(window).innerHeight()) {
      return false;
    }
    elWidth = el$.outerWidth();
    if (offset.left + elWidth > $(window).innerWidth()) {
      return false;
    }
    return true;
  };

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
      $(document).on('opened', '.reveal-modal[data-reveal]', function () {
        var this$;
        this$ = $(this);
        $root.$broadcast('bmp.foundation.revealOpened', this$.attr('id'), this$);
        if (!isEntirelyVisible(this$)) {
          this$.css('top', '0px');
          setTimeout(function () {
            this$.css('top', '100px');
          }, 50);
        }
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
          var confirmCallbacks, pokeFoundation, observer, startWatching, stopWatching;

          confirmCallbacks = {};

          pokeFoundation = _.throttle(function () {
            $timeout(function () {
              $root.$evalAsync(function () {
                // https://github.com/zurb/foundation/issues/2956
                $(window).off('scroll'); // temporary fix to clear Magellan
                // temporary fix to clear Reveal
                $('body').off('keyup.fndtn.reveal');

                // reinitialise Foundation
                $(document.body).foundation();
              });
            }, 0);
          }, 1e3, { leading: true, trailing: true });

          $scope.openRevealModal = function (id) {
            var modal$;
            modal$ = $('#' + id);
            modal$.foundation('reveal', 'open');
          };

          $scope.alertWithReveal = function (options, callback) {
            options.asyncId = String(Math.random());
            if (_.isFunction(callback)) {
              confirmCallbacks[options.asyncId] = callback;
            }
            $root.$broadcast('bmp.foundation.alert', options);
            $scope.openRevealModal('bmpFoundationAlert');
          };

          $scope.confirmWithReveal = function (options, callback) {
            options.asyncId = String(Math.random());
            if (_.isFunction(callback)) {
              confirmCallbacks[options.asyncId] = callback;
            }
            $root.$broadcast('bmp.foundation.confirm', options);
            $scope.openRevealModal('bmpFoundationConfirm');
          };

          /*jslint unparam:true*/ // $event
          $scope.$on('bmp.foundation.alerted', function ($event, id) {
            if (_.isFunction(confirmCallbacks[id])) {
              confirmCallbacks[id]();
            }
            delete confirmCallbacks[id];
          });
          /*jslint unparam:false*/

          /*jslint unparam:true*/ // $event
          $scope.$on('bmp.foundation.confirmed', function ($event, id, result) {
            if (_.isFunction(confirmCallbacks[id])) {
              confirmCallbacks[id](result);
            }
            delete confirmCallbacks[id];
          });
          /*jslint unparam:false*/

          // determine how to poke Foundation when necessary
          if (window.MutationObserver) {
            observer = new window.MutationObserver(function () { // param: mutations
              // called whenever document.body changes
              pokeFoundation();
            });
            startWatching = function () {
              observer.observe(document.body, {
                childList: true,
                attributes: true,
                subtree: true,
                attributeFilter: [
                  'data-interchange',
                  'data-topbar',
                  'data-orbit',
                  'data-clearing',
                  'data-abide',
                  'data-alert',
                  'data-tooltip',
                  'data-joyride',
                  'data-accordion',
                  'data-tab',
                  'data-dropdown',
                  'data-dropdown-content',
                  'data-magellan-expedition',
                  'data-magellan-destination',
                  'data-magellan-arrival',
                  'data-reveal-id'
                ]
              });
              pokeFoundation();
            };
            stopWatching = function () {
              observer.disconnect();
            };

          } else {
            startWatching = function () {
              stopWatching = $scope.$watch(pokeFoundation);
              pokeFoundation();
            };
          }

          // poke Foundation when necessary
          startWatching();
          $(document).on('open close', '[data-reveal]', function () {
            stopWatching();
          });
          $(document).on('opened closed', '[data-reveal]', function () {
            startWatching();
          });
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
        if (id === 'bmpFoundationConfirm') {
          $root.$broadcast('bmp.foundation.confirmed', $scope.asyncId, $scope.result);
        }
      });
      /*jslint unparam:false*/
    }
  ]);

  mod.controller('bmpFoundationAlertCtrl', [
    '$scope', '$rootScope',
    function ($scope, $root) {
      $scope.title = '';
      $scope.lead = '';
      $scope.body = '';
      $scope.asyncId = null;

      /*jslint unparam:true*/ // $event
      $scope.$on('bmp.foundation.alert', function ($event, options) {
        $scope.title = options.title;
        $scope.lead = options.lead;
        $scope.body = options.body;
        $scope.asyncId = options.asyncId;
      });
      /*jslint unparam:false*/

      /*jslint unparam:true*/ // $event
      $scope.$on('bmp.foundation.revealClosed', function ($event, id) {
        if (id === 'bmpFoundationAlert') {
          $root.$broadcast('bmp.foundation.alerted', $scope.asyncId);
        }
      });
      /*jslint unparam:false*/
    }
  ]);


  return mod;
}));
