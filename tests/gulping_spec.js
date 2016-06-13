'use strict';

var sinon = require('sinon');
var chai = require('chai');
var gulping = require('../gulping/gulping');
var gulp = require('gulp');
var gulpUtil = require('gulp-util');

describe('gulping', function () {

  it('Should initialize without arguments', function () {
    gulping.initialize();
  });

  it('should initialize with arguments', function () {
    gulping.initialize(gulp, {});
  });

  it('should create a version string', function () {
    gulping.initialize(gulp, {});
    gulping.create
  })

});