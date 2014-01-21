/*jslint indent:2, browser:true, sloppy:true*/
/*globals suite, test, setup, teardown, suiteSetup, suiteTeardown*/ // Mocha
/*globals chai*/ // Chai

/*globals $, angular*/ // subject of test
/*jslint nomen:true*/ // $._data

var assert = chai.assert;

suite('click event handlers bound by Foundation Reveal', function () {
  var confirm$;

  suiteSetup(function (done) {
    $(document).ready(function () {
      setTimeout(done, 0);
    });
  });

  setup(function (done) {
    confirm$ = $('#alertBtn');
    setTimeout(done, 1500);
  });

  test('one click event bound initially', function () {
    var events;
    events = $._data(confirm$[0], 'events');
    assert.isObject(events);
    assert.isArray(events.click);
    assert.lengthOf(events.click, 1);
  });

  test('one click event bound after $digest()s', function () {
    var events, $scope;
    $scope = angular.element(document.body).scope();
    $scope.$digest();

    events = $._data(confirm$[0], 'events');
    assert.isObject(events);
    assert.isArray(events.click);
    assert.lengthOf(events.click, 1);
  });

});
