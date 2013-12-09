/*jslint indent:2, browser:true, sloppy:true*/
/*globals suite, test, setup, teardown, suiteSetup, suiteTeardown*/ // Mocha
/*globals chai*/ // Chai

/*globals $, angular*/ // subject of test

var assert = chai.assert;

suite('$scope.confirmWithReveal() + okay', function () {
  var confirm$, modal$, output$;

  suiteSetup(function (done) {
    $(document).ready(function () {
      setTimeout(done, 1e3);
    });
  });

  setup(function () {
    confirm$ = $('#alertBtn');
    modal$ = $('#bmpFoundationAlert');
    output$ = $(document.body).children('main').children('output');
  });

  test('no modals open initially', function () {
    assert.lengthOf($('.reveal-modal').filter(':visible'), 0);
  });

  test('opens reveal modal', function (done) {
    $(document).one('opened', '.reveal-modal[data-reveal]', function () {
      assert.notEqual(modal$.css('display', 'none'));
      done();
    });
    confirm$.trigger('click');
  });

  test('populates reveal modal with desired content', function () {
    assert.equal(modal$.children('h2').text(), 'Title!');
    assert.equal(modal$.children('p.lead').text(), 'Lead paragraph!');
    assert.equal(modal$.children('p').filter(':not(.lead)').text(), 'Body paragraph!');
  });

  test('confirm closes modal', function (done) {
    $(document).one('closed', '.reveal-modal[data-reveal]', function () {
      assert.equal(modal$.css('display'), 'none');
      setTimeout(done, 300);
    });
    modal$.find('button').trigger('click');
  });

  test('confirm triggers correct output', function () {
    assert.equal(output$.text(), 'alerted!');
  });

});

suite('$scope.confirmWithReveal() + close', function () {
  var confirm$, modal$, output$;

  suiteSetup(function (done) {
    $(document).ready(function () {
      setTimeout(done, 1e3);
    });
  });

  setup(function () {
    confirm$ = $('#alertBtn');
    modal$ = $('#bmpFoundationAlert');
    output$ = $(document.body).children('main').children('output');
  });

  test('no modals open initially', function () {
    assert.lengthOf($('.reveal-modal').filter(':visible'), 0);
  });

  test('opens reveal modal', function (done) {
    $(document).one('opened', '.reveal-modal[data-reveal]', function () {
      assert.notEqual(modal$.css('display', 'none'));
      done();
    });
    confirm$.trigger('click');
  });

  test('populates reveal modal with desired content', function () {
    assert.equal(modal$.children('h2').text(), 'Title!');
    assert.equal(modal$.children('p.lead').text(), 'Lead paragraph!');
    assert.equal(modal$.children('p').filter(':not(.lead)').text(), 'Body paragraph!');
  });

  test('close closes modal', function (done) {
    $(document).one('closed', '.reveal-modal[data-reveal]', function () {
      assert.equal(modal$.css('display'), 'none');
      setTimeout(done, 300);
    });
    modal$.find('a.close-reveal-modal').trigger('click');
  });

  test('close triggers correct output', function () {
    assert.equal(output$.text(), 'alerted!');
  });

});
