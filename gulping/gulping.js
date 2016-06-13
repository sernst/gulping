'use strict';

var gulpPlumber = require('gulp-plumber');
var gulpNotify = require('gulp-notify');
var path = require('path');
var utils = require('./gulping_utils');
var support = require('./gulping_support');

utils.gulping = exports;
exports.utils = utils;


/**
 *
 * @returns {*}
 */
function gulperSource() {
  return exports.gulp.src.apply(exports.gulp, arguments)
      .pipe(gulpPlumber({
        errorHandler: function(err) {
          gulpNotify.onError({
            title:    "Gulp Error",
            message:  "Error: <%= error.message %>",
            sound:    "Bottle"
          })(err);
          this.emit('end');
        }
      }));
}
exports.src = gulperSource;


/**
 *
 * @returns {*}
 */
function gulperDest() {
  return exports.gulp.dest(
      utils.makeDestPath.apply(exports.gulp, arguments)
  );
}
exports.dest = gulperDest;


/**
 * Configures the Nunjucks Render
 * @param templateRoot
 * @param nunjucksRender
 */
function configureNunjucks(templateRoot, nunjucksRender) {
  nunjucksRender = nunjucksRender || exports.nunjucksRender;
  if (!nunjucksRender) {
    return false;
  }

  if (!templateRoot) {
    if (!exports.settings.nunjucks || !exports.settings.nunjucks.templateRoot) {
      return false;
    }

    templateRoot = exports.settings.nunjucks.templateRoot;
  }

  exports.nunjucksRender.nunjucks.configure(
      templateRoot,
      {
        watch: false,
        tags: {
          blockStart: '<%',
          blockEnd: '%>',
          variableStart: '<$',
          variableEnd: '$>',
          commentStart: '<#',
          commentEnd: '#>'
        }
      });
  return true;
}
exports.configureNunjucks = configureNunjucks;


/**
 *
 * @param gulp
 * @param options
 * @returns {*}
 */
function initialize(gulp, options) {
  options = options || {};
  exports.gulp = gulp;

  support.loadOptions(exports, options);

  var now = new Date();
  exports.settings.BUILD_DATE = now;
  exports.args.BUILD_TIMESTAMP = now.toUTCString();

  console.log('');
  if (exports.args.production) {
    console.log('*******************************************');
    console.log('***             PRODUCTION              ***');
    console.log('*******************************************');
  }

  console.log(
      'LOCAL:',
      now,
      '(gulping.settings.BUILD_DATE)'
  );

  console.log(
      'UTC:',
      now.toUTCString(),
      '(gulping.args.BUILD_TIMESTAMP)'
  );

  exports.args.PLATFORM = support.identifyPlatform();
  console.log(
      'PLATFORM:',
      exports.args.PLATFORM,
      '(gulping.args.PLATFORM)'
  );

  exports.args.BUILD_ID = support.createBuildId(exports, now);
  console.log(
      'BUILD ID:',
      exports.args.BUILD_ID,
      '(gulping.args.BUILD_ID)'
  );

  exports.args.VERSION = support.createVersion(now);
  console.log(
      'VERSION:',
      exports.args.VERSION,
      '(gulping.args.VERSION)'
  );

  exports.args.TIMESTAMP = Math.floor(
      (now.getTime() - Date.UTC(2016, 0, 1))/60000
  ).toString(36);

  console.log(
      'TIMESTAMP:',
      exports.args.TIMESTAMP,
      '(gulping.args.TIMESTAMP)'
  );

  var buildFolder = exports.args.production ?
      exports.settings.build.release_folder :
      exports.settings.build.development_folder;
  if (!buildFolder) {
    buildFolder = path.join(process.cwd(), 'build');
  }
  exports.args.BUILD_FOLDER = buildFolder;

  // Sets the base directory for nunjucks template lookup
  exports.configureNunjucks();

  console.log('');
  return exports;
}
exports.initialize = initialize;
