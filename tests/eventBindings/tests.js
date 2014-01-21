/*jslint indent:2, browser:true, sloppy:true*/
/*globals suite, test, setup, teardown, suiteSetup, suiteTeardown*/ // Mocha
/*globals chai*/ // Chai

/*globals $, angular*/ // subject of test
/*jslint nomen:true*/ // $._data

var assert = chai.assert;

suite('Foundation Reveal and a[data-reveal-id]', function () {
  var confirm$, new$;

  suiteSetup(function (done) {
    confirm$ = $('#alertBtn');
    $(document).ready(function () {
      setTimeout(done, 0);
    });
  });

  test('one click event bound initially', function (done) {
    var events;
    events = $._data(confirm$[0], 'events');
    assert.isObject(events);
    assert.isArray(events.click);
    assert.lengthOf(events.click, 1);
    setTimeout(done, 1500);
  });

  test('one click event bound after $digest()s', function (done) {
    var events, $scope;
    $scope = angular.element(document.body).scope();
    $scope.$digest();

    events = $._data(confirm$[0], 'events');
    assert.isObject(events);
    assert.isArray(events.click);
    assert.lengthOf(events.click, 1);
    setTimeout(done, 1500);
  });

  test('add a new button hyperlink to page', function (done) {
    new$ = $('<a class="button" data-reveal-id="testModal" data-reveal="">new</a>').appendTo(document.body);
    assert.isUndefined($._data(new$[0], 'events'));
    setTimeout(done, 1750);
  });

  test('first hyperlink still bound only once', function (done) {
    var events, $scope;
    $scope = angular.element(document.body).scope();
    $scope.$digest();

    events = $._data(confirm$[0], 'events');
    assert.isObject(events);
    assert.isArray(events.click);
    assert.lengthOf(events.click, 1);
    setTimeout(done, 1500);
  });

  test('one click event bound after waiting...', function (done) {
    var events;
    events = $._data(new$[0], 'events');
    assert.isObject(events);
    assert.isArray(events.click);
    assert.lengthOf(events.click, 1);
    setTimeout(done, 1500);
  });

});
