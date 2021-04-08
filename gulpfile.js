/* jslint es6 */
/* global require, process, console, __dirname */

// functions to extend Nunjucks environment
const toUpper = string => string.toUpperCase();
const spaceToDash = string => string.replace(/\s+/g, '-');

const CaptureTag = require('nunjucks-capture');

const templateConfig = {
  engineOptions: {
    path: `${__dirname}/layouts`,
    filters: {
      toUpper,
      spaceToDash,
    },
    extensions: {
      CaptureTag: new CaptureTag(),
    },
  },
};

const path = require('path');
const gulp = require('gulp');
const { series } = require('gulp');
const sequence = require('gulp-sequence');
const order = require('gulp-order');
const sass = require('gulp-sass');
const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const concat = require('gulp-concat');
const compressJS = require('gulp-uglify');
const browserSync = require('browser-sync').create();
const metalsmith = require('metalsmith');
const drafts = require('metalsmith-drafts');
const assets = require('metalsmith-assets');
const inplace = require('metalsmith-in-place');
// we are using a branch of metalsmith-metadata: https://github.com/JemBijoux/metalsmith-metadata/tree/ext-data-sources
// which solves the data file outside the content folder bug of the original plugin
const metadata = require('metalsmith-metadata-ext-data-sources');
const permalinks = require('metalsmith-permalinks');
const writemetadata = require('metalsmith-writemetadata');
const addCanonicalURL = require('metalsmith-add-canonical');

// file system paths
const srcPath = './src/content/';
const destPath = './build/';
const metadataPath = './src/data/site.yml';
const programsdataPath = './src/data/programs.yml';
const teamPath = './src/data/team.yml';
const sponsorsPath = './src/data/sponsors.yml';
const contactPath = './src/data/contact.yml';
const eduProgSonsorsPath = './src/data/educator-programs-sponsors.yml';
const teachingSubjectsPath = './src/data/what-we-teach.yml';
const rebeccaSchedulePath = './src/data/rebecca-schedule.yml';
const newsPath = './src/data/in-the-news.yml';
const stylePath = './src/styles/';
const scriptPath = './src/scripts/';
const assetPath = './src/sources/';
const assetDest = './';
const iconPath = './icons/';

function setUpMS(callback) {
  metalsmith(__dirname)
    .clean(true)
    .source(srcPath)
    .destination(destPath)

    .use(drafts())

    .use(
      metadata({
        files: {
          site: metadataPath,
          programs: programsdataPath,
          team: teamPath,
          sponsors: sponsorsPath,
          contact: contactPath,
          educationProgramSponsors: eduProgSonsorsPath,
          teachingSubjects: teachingSubjectsPath,
          rebeccaSchedule: rebeccaSchedulePath,
          inTheNews: newsPath,
        },
        config: {
          isExternalSrc: true,
        },
      })
    )
    .use(addCanonicalURL())
    .use(inplace(templateConfig))
    .use(permalinks())

    // enable this code to generate a metadata json file for each page
    // .use(writemetadata({
    //    pattern: ["**/*.html"],
    //    ignorekeys: ["next", "contents", "previous"],
    //    bufferencoding: "utf8"
    // }))

    .use(
      assets({
        source: assetPath,
        destination: assetDest,
      })
    )

    .build(function(err) {
      if (err) {
        return callback(err);
      }
      callback();
    });
}

gulp.task('metalsmith', callback => setUpMS(callback));

// compile style sheet for dev
gulp.task('styles', function() {
  return gulp
    .src(path.join(__dirname, stylePath, 'main.scss'))
    .pipe(sourcemaps.init())
    .pipe(sass({ style: 'expanded' }))
    .pipe(autoprefixer('last 2 version'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(path.join(__dirname, assetPath, 'assets/styles')));
});

// compile vendor scripts
gulp.task('vendorScripts', function() {
  return gulp
    .src([
      'node_modules/jquery/dist/jquery.js',
      'node_modules/jquery.easing/jquery.easing.js',
      'node_modules/jquery-hoverintent/jquery.hoverIntent.js',
    ])
    .pipe(concat('vendors.min.js'))
    .pipe(compressJS())
    .pipe(gulp.dest(path.join(__dirname, assetPath, 'assets/scripts')));
});

const calScripts = [
  'node_modules/moment/min/moment.min.js',
  'node_modules/fullcalendar/dist/fullcalendar.min.js',
  'node_modules/fullcalendar/dist/gcal.min.js',
];

// compile full calendar scripts
gulp.task('getCalendarScripts', function() {
  return gulp
    .src(calScripts)
    .pipe(gulp.dest(path.join(__dirname, assetPath, 'assets/scripts')));
});

// compile scripts for dev
gulp.task('scripts', function() {
  return gulp
    .src(path.join(__dirname, scriptPath, '**/*.js'))
    .pipe(sourcemaps.init())
    .pipe(
      babel({
        presets: ['es2015'],
      })
    )
    .pipe(
      order([
        path.join(__dirname, scriptPath, 'ready.js'),
        path.join(__dirname, scriptPath, 'modules/**.js'),
      ])
    )
    .pipe(concat('main.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(path.join(__dirname, assetPath, 'assets/scripts')));
});

// we are using custom icon fonts from icomoon. They are located in folder './icons'
// the next three tasks move the icon files into 'src/sources/assets/fonts' and the
// two style files 'variables.scss' and 'style.scss' into 'src/styles/icons'
gulp.task('getIcons', function() {
  return gulp
    .src(path.join(__dirname, iconPath, 'fonts/**.*'))
    .pipe(gulp.dest(path.join(__dirname, assetPath, 'assets/styles/fonts')));
});
gulp.task('getIconStyles', function() {
  return gulp
    .src(path.join(__dirname, iconPath, 'style.scss'))
    .pipe(gulp.dest(path.join(__dirname, stylePath, 'icons')));
});
gulp.task('getIconVariables', function() {
  return gulp
    .src(path.join(__dirname, iconPath, 'variables.scss'))
    .pipe(gulp.dest(path.join(__dirname, stylePath, 'icons')));
});
gulp.task('getCalendarCSS', function() {
  return gulp
    .src('node_modules/fullcalendar/dist/fullcalendar.min.css')
    .pipe(gulp.dest(path.join(__dirname, assetPath, 'assets/styles')));
});

// build the dev instance. styles and script files will have source mapos embedded for debugging
// we first build all site assets and then call metalsmith to assemble the site
// since gulp processes tasks in parallel we'll use the gulp plugin gulp-sequence
// sequence will process all tasks serially except the one in square bracket, these will be processed in parallel
// this insures that all site assets are ready before metallsmith assembles the site.
gulp.task(
  'buildDev',
  series(
    'getIconVariables',
    'getIconStyles',
    'getIcons',
    'getCalendarCSS',
    ['styles', 'vendorScripts', 'getCalendarScripts', 'scripts'],
    'metalsmith',
    function(cb) {
      cb();
    }
  )
);

// having buildDev as a dependency for the refresh task insures that they are executed before browerSync is run
// reference: browsersync.io/docs/gulp
gulp.task(
  'refresh',
  gulp.series('buildDev', function(done) {
    browserSync.reload();
    done();
  })
);

const watch = function() {
  gulp.watch(`${srcPath}**/*`, `refresh`);
  gulp.watch(`${stylePath}**/*`, `refresh`);
  gulp.watch(`${scriptPath}**/*`, `refresh`);
};

gulp.task(
  'default',
  gulp.series('buildDev', function() {
    browserSync.init({
      server: {
        baseDir: 'build',
      },
      open: false,
    });

    gulp.series(watch);
  })
);

gulp.task('productionScripts', function() {
  return gulp
    .src(path.join(__dirname, scriptPath, '**/*.js'))
    .pipe(babel())
    .pipe(concat('main.js'))
    .pipe(gulp.dest(path.join(__dirname, assetPath, 'assets/scripts')));
});

// compile style sheet for development
gulp.task('productionStyles', function() {
  return gulp
    .src(path.join(__dirname, stylePath, 'main.scss'))
    .pipe(sass({ style: 'compressed' }))
    .pipe(autoprefixer('last 2 version'))
    .pipe(gulp.dest(path.join(__dirname, assetPath, 'assets/styles')));
});

gulp.task(
  'buildProd',
  series(
    'vendorScripts',
    'productionScripts',
    'productionStyles',
    'metalsmith',
    function(cb) {
      cb();
    }
  )
);
