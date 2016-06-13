'use strict';

var plugsFunc = require('gulp-load-plugins');
var path = require('path');

/**
 *
 * @param gulping
 * @returns {string}
 */
function createBuildId(gulping, now) {
  var out = gulping.args.production ? '' : 'D';
  [ now.getUTCFullYear().toString().slice(2),
    now.getUTCMonth() + 1,
    now.getUTCDate(),
    now.getUTCHours(),
    now.getUTCMinutes()
  ].forEach(function (entry) {
    entry = entry.toString();
    out += entry.length > 1 ? entry : ('0' + entry);
  });

  return out;
}
exports.createBuildId = createBuildId;


/**
 *
 * @returns {string}
 */
function createVersion(now) {
  var versionMinor = 31.0 * now.getUTCMonth() + now.getUTCDate();
  var versionRevision = 0.5 * (
      now.getUTCMinutes() + 60.0 * now.getUTCHours()
  );

  return [
    now.getUTCFullYear() - 2015,
    Math.floor(versionMinor),
    Math.floor(versionRevision)
  ].join('.');
}
exports.createVersion = createVersion;


/**
 *
 * @param gulping
 * @param options
 */
function loadOptions(gulping, options) {
  gulping.args = options.args || {};
  gulping.directoryName = options.directoryName || process.cwd();
  gulping.sources = options.sources || {};
  gulping.nunjucksRender = options.nunjucksRender;
  gulping.settings = options.settings || {build:{}};

  gulping.plugs = options.plugs;
  if (!gulping.plugs) {
    gulping.plugs = plugsFunc({
      config: path.join(gulping.directoryName, 'package.json')
    });
  }
}
exports.loadOptions = loadOptions;


/**
 *
 * @returns {string}
 */
function identifyPlatform() {
  if (process.platform === 'darwin') {
    return 'osx';
  }

  return (process.platform === 'win32') ? 'win' : 'linux';
}
exports.identifyPlatform = identifyPlatform;