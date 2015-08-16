# thunk-runner

[![NPM version][npm-image]][npm-url] [![js-xo-style][codestyle-image]][codestyle-url]

> Execute each thunk in an array of thunks, nonconcurrently

## Installation

Install `thunk-runner` using [npm](https://www.npmjs.com/):

```bash
npm install --save thunk-runner
```

## Usage

### Module usage

```javascript
var thunkRunner = require('thunk-runner');

// Example creating folders and files:
var fs = require('fs');
// mkdir which returns a thunk:
var mkdir = function (dir) {
  return function (cb) {
    return fs.mkdir(dir, cb);
  };
};
// writeFile which returns a thunk:
var writeFile = function (file, content) {
  return function (cb) {
    return fs.writeFile(file, content, 'utf8', cb);
  };
};

var thunks = [
  mkdir('src'),
  mkdir('src/folder'),
  writeFile('src/folder/index.js', 'var test = 1;\n')
];

thunkRunner(thunks)(function (err) {
  // done...
});
```

## API

### `thunkRunner(thunks)`

| Name | Type | Description |
|------|------|-------------|
| thunks | `Array` | The thunks to execute |

Runs all thunks in the given array, one at a time, waiting on each to complete before running the next. Returns a thunk.

## License

MIT

[npm-url]: https://npmjs.org/package/thunk-runner
[npm-image]: https://badge.fury.io/js/thunk-runner.svg
[codestyle-url]: https://github.com/sindresorhus/xo
[codestyle-image]: https://img.shields.io/badge/code%20style-xo-brightgreen.svg?style=flat
