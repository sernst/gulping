'use strict';

var gulpIf = require('gulp-if');
var replace = require('gulp-replace');
var gulpUtil = require('gulp-util');
var path = require('path');

exports.gulping = {};

/**
 *
 * @param functionArguments
 * @returns {Array.<*>}
 */
function argumentsArray(functionArguments) {
  return Array.prototype.slice.call(functionArguments);
}
exports.argumentsArray = argumentsArray;


/**
 * Converts a gulp stream into a JavaScript promise that is resolved when the
 * stream completes. Useful for sequencing stream-related events that cannot
 * be easily chained together using gulp directly.
 *
 * @param stream
 * @returns {Promise}
 */
function streamToPromise(stream) {
  return new Promise(function(resolve, reject) {
    stream.on('end', resolve).on('error', reject);
  });
}
exports.streamToPromise = streamToPromise;


/**
 * Creates a build path relative to the project root path
 */
function makeDestPath() {
  var paths = [exports.gulping.args.BUILD_FOLDER]
      .concat(argumentsArray(arguments));

  return path.join.apply(null, paths);
}
exports.makeDestPath = makeDestPath;


/**
 * @param stream
 * @param items
 */
function replaceInStream(stream, items) {
  if (!items) {
    return stream;
  }

  function doReplace(src, before, after) {
    return src.pipe(replace(before, after));
  }

  if (Array.isArray(items)) {
    items.forEach(function (item) {
      stream = doReplace(stream, item[0], item[1]);
    });
    return stream;
  }

  Object.keys(items).forEach(function (before) {
    stream = doReplace(stream, before, items[before]);
  });
  return stream;
}
exports.replaceInStream = replaceInStream;


/**
 * Extends the target array with the entries from the "from" array. If the
 * from array is not an array it will instead be pushed onto the array.
 *
 * @param target
 * @param extension
 */
function extendArray(target, extension) {
  if (arguments.length < 2) {
    return target;
  }

  argumentsArray(arguments).forEach(function (arg) {
    if (!arg) {
      return;
    }

    if (!Array.isArray(arg)) {
      target.push(arg);
    } else {
      arg.forEach(function (v) {
        target.push(v);
      });
    }
  });

  return target;
}
exports.extendArray = extendArray;


/**
 *
 * @param yes
 * @param no
 * @returns {*}
 */
function ifProduction(yes, no) {
  if (!yes) {
    yes = gulpUtil.noop();
  }
  if (!no) {
    no = gulpUtil.noop();
  }

  return gulpIf(exports.gulping.args.production, yes, no);
}
exports.ifProduction = ifProduction;