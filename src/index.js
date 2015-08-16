'use strict';

module.exports = function thunkRunner(thunks) {
  return function (done) {
    var i = 0;
    (function next(err) {
      if (err) {
        return done(err);
      } else if (i === thunks.length) {
        return done();
      }
      try {
        thunks[i++](next);
      } catch (e) {
        return done(e);
      }
    })();
  };
};
