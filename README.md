# angular-foundation

Our bindings between [ZURB's Foundation](foundation.zurb.com) and [Angular.JS](angularjs.org).

## Prerequisites

- Require.JS with its `text!` plugin

- Angular.JS, registered with Require.JS as "angular"

- Foundation, registered with Require.JS as "foundation"

- jQuery, registered with Require.JS as "jquery"

- LoDash, registered with Require.JS as "lodash"


## Installation

Copy both `partial.html` and `module.js` to a directory within your project, or use `git submodule` to add this repository to your project.

It is suggested that these files be accessible via `/js/components/angular-foundation/`. However, it ought to be possible to reuse these files with any directory scheme, provided Require.JS has the necessary path registration.

Load this component in with Require.JS, then make your Angular.JS app depend on the module it exposes, like so:

```
// assuming Require.JS's baseUrl is set to the 'js' directory...
define([
  'angular',
  'components/angular-foundation/module'
], function (ng) {
  var app;
  app = angular.module('app', ['bmp.foundation']);

  // TODO: define the rest of your Angular.JS app...  
});
```

Add the `bmp-foundation` attribute to the body element, like so:

```
<body x-bmp-foundation="">
```

## Usage

Make sure that all Foundation Reveal modals are defined with:

- the `data-reveal` attribute

- a page-unique `id` attribute.


### a[bmp-close-reveal], button[bmp-close-reveal]

1. Create a Foundation Reveal modal.

2. Add the `bmp-close-reveal` attribute to any of the elements within the modal.

This element may be clicked to close its parent modal.

### a[bmp-open-reveal=id], button[bmp-open-reveal=id]

1. Create a Foundation Reveal modal. 

2. Add the `bmp-open-reveal` attribute to any clickable element on your page, settings its value to the `id` attribute of the desired target modal.

This element may be clicked to open the target modal.

### $scope.closeRevealModal ()

1. Create a Foundation Reveal modal, and attach an Angular.JS controller to it with the `ng-controller` attribute.

The controller's `$scope` has a `closeRevealModal()` method automatically defined. This method can be called anywhere within the controller's scope in order to close the modal.

### $scope.$on ('revealModalClosed', handler)

You may hook this Angular.JS event from any `$scope` in order to be notified whenever any Foundation Reveal modal is closed.

- {Function} `handler` - called when the event triggers

    - {ng.Event} `$event` - Angular's wrapped Event object
    
    - {String} `id` - the unique `id` attribute from the modal element
    
    - {Element$} `el$` - the modal element, wrapped by jQuery or `angular.element`

### $scope.openRevealModal (id)

Call this from any `$scope` to open the Reveal modal with the matching `id`.

- {String} `id` - unique ID for the target modal element

### $scope.confirmWithReveal (options, callback)

Call this from any `$scope` to open a Reveal modal for the purpose of prompting the user and receiving a `true` or `false` value based on their input.

- {Object} `options` - values controlling the presentation of the modal

    - {String} [`title`] - text displayed in very large font at the top
    
    - {String} [`lead`] - text displayed in large font beneath `title` (if any)
    
    - {String} [`body`] - text displayed in regular font beneath `lead` (if any)

- {Function} `callback` - called once the user makes their choice

    - {Boolean} `result` - the user's response