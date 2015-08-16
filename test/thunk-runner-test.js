'use strict';
var test = require('tape');
var thunkRunner = require('../src');

test('thunkRunner runs each thunk in an array of thunks', function (assert) {
  assert.plan(2);

  var tot = 0;
  function sum(num) {
    return function (cb) {
      tot += num;
      cb();
    };
  }

  var thunks = [1, 2, 3, 4].map(sum);

  thunkRunner(thunks)(function (err) {
    assert.error(err, 'No error should occur');
    assert.equal(tot, 10, 'All thunks should have been called');
  });
});

test('thunkRunner runs each thunk nonconcurrently', function (assert) {
  assert.plan(2);

  var actual = [];
  function push(num) {
    return function (cb) {
      actual.push(num);
      cb();
    };
  }

  var nums = [1, 2, 3, 4];
  var thunks = nums.map(push);

  thunkRunner(thunks)(function (err) {
    assert.error(err, 'No error should occur');
    assert.same(actual, nums, 'The order should be kept');
  });
});

test('thunkRunner stops on error', function (assert) {
  assert.plan(2);

  var actual = [];
  function push(num) {
    return function (cb) {
      actual.push(num);
      if (num === 2) {
        return cb(new Error('Stop it!'));
      }
      cb();
    };
  }

  var nums = [1, 2, 3, 4];
  var thunks = nums.map(push);

  thunkRunner(thunks)(function (err) {
    assert.equal(err.message, 'Stop it!', 'An error should occur');
    assert.same(actual, nums.slice(0, 2), 'Only the first two iterations should have run');
  });
});

test('thunkRunner stops on exceptions', function (assert) {
  assert.plan(1);

  function kill() {
    return function () {
      throw new Error('Oh noes!');
    };
  }

  var nums = [1, 2, 3, 4];
  var thunks = nums.map(kill);

  thunkRunner(thunks)(function (err) {
    assert.equal(err.message, 'Oh noes!', 'An error should occur');
  });
});

test('thunkRunner can run an array of thunkRunners', function (assert) {
  assert.plan(2);

  var tot = 0;
  function sum(num) {
    return function (cb) {
      tot += num;
      cb();
    };
  }

  var thunks = [1, 2, 3, 4].map(sum);

  var thunkRunners = [
    thunkRunner(thunks),
    thunkRunner(thunks)
  ];

  thunkRunner(thunkRunners)(function (err) {
    assert.error(err, 'No error should occur');
    assert.equal(tot, 20, 'All thunks in all thunkRunners should have been called');
  });
});
