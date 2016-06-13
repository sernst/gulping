'use strict';

var sinon = require('sinon');
var assert = require('chai').assert;
var gulping = require('../gulping/gulping');
var gulp = require('gulp');
var gulpUtil = require('gulp-util');
var gulpNotify = require('gulp-notify');
var qfs = require('q-io/fs');

describe('gulping.utils', function () {

  beforeEach(function () {
    gulping.initialize(gulp, {});
  });

  it('ifProduction [false]', function () {
    var success;
    var stream = gulping.src('.gitignore')
        .pipe(gulping.utils.ifProduction(
            null,
            gulpNotify(function test(v) {
              success = true;
              return v;
            })
        ));

    return gulping.utils.streamToPromise(
        stream.pipe(gulping.dest())
    )
        .then(function () {
          return qfs.removeTree(gulping.utils.makeDestPath());
        })
        .then(function () {
          assert.isTrue(success);
        });
  });

  it('ifProduction [true]', function () {
    var success;

    gulping.args.production = true;
    var stream = gulping.src('.gitignore')
        .pipe(gulping.utils.ifProduction(
            gulpNotify(function test(v) {
              success = true;
              return v;
            }),
            null
        ));

    return gulping.utils.streamToPromise(
        stream.pipe(gulping.dest())
    )
        .then(function () {
          return qfs.removeTree(gulping.utils.makeDestPath());
        })
        .then(function () {
          assert.isTrue(success);
        });
  });

  it('argumentsArray [empty]', function () {
    var result = gulping.utils.argumentsArray(arguments)
    assert.equal(0, result.length);
    assert.isArray(result);
  });

  it('argumentsArray', function () {
    function test() {
      return gulping.utils.argumentsArray(arguments);
    }
    var result =  test('a', 'b', true, 42);
    assert.equal(4, result.length);
    assert.isArray(result);
  });

  it('streamToPromise', function () {
    return gulping.utils.streamToPromise(
        gulp.src('*.fake')
            .pipe(gulpUtil.noop())
            .pipe(gulp.dest('nosuchfolder'))
    ).then(function () {
      return true;
    });
  });

  it('makeDestPath', function () {
    gulping.args.BUILD_FOLDER = '/fake/path';
    var result = gulping.utils.makeDestPath('a', 'b', 'c');
    assert.equal(result, '/fake/path/a/b/c');
  });
  
});