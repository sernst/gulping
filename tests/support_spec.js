'use strict';

var assert = require('chai').assert;
var gulp = require('gulp');
var gulping = require('../gulping/gulping');
var support = require('../gulping/gulping_support');

describe('gulping support', function () {
  var now;

  beforeEach(function () {
    gulping.args = {};
    now = new Date();
  });

  it('createBuildId', function () {
    var result = support.createBuildId(gulping, now);
    assert.isNotNull(result);
  });

});