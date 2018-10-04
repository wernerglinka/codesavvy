/*jslint es6*/
/*global require, process, console, __dirname*/

// functions to extend Nunjucks environment
const toUpper = (string) => string.toUpperCase();
const spaceToDash = (string) => string.replace(/\s+/g, "-");

const CaptureTag = require('nunjucks-capture');

const templateConfig = {
    engineOptions: {
        path: __dirname + '/layouts',
        filters: {
            toUpper: toUpper,
            spaceToDash: spaceToDash
        },
        extensions: {
            CaptureTag: new CaptureTag()
        }
    }
};

const path = require("path");
const gulp = require('gulp');
const sequence = require('gulp-sequence');
const order = require("gulp-order");
const sass = require('gulp-sass');
const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const concat = require('gulp-concat');
const compressJS = require("gulp-uglify");
const browserSync = require('browser-sync').create();
const metalsmith = require('metalsmith');
const assets = require("metalsmith-assets");
const inplace = require('metalsmith-in-place');
// we are using a branch of metalsmith-metadata: https://github.com/JemBijoux/metalsmith-metadata/tree/ext-data-sources
// which solves the data file outside the content folder bug of the original plugin
const metadata = require('metalsmith-metadata-ext-data-sources');
const permalinks = require("metalsmith-permalinks");
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
const stylePath = './src/styles/';
const scriptPath = './src/scripts/';
const assetPath = './src/sources/';
const assetDest = './';
const iconPath = './icons/';

function setUpMS(callback) {
    "use strict";
    metalsmith(__dirname)
        .clean(true)
        .source(srcPath)
        .destination(destPath)

        .use(metadata({
            "files": {
                "site": metadataPath,
                "programs": programsdataPath,
                "team": teamPath,
                "sponsors": sponsorsPath,
                "contact": contactPath,
                "educationProgramSponsors": eduProgSonsorsPath,
                "teaching_subjects": teachingSubjectsPath
            },
            "config": {
                isExternalSrc: true
            }
        }))
        .use(addCanonicalURL())
        .use(inplace(templateConfig))
        .use(permalinks())

        // enable this code to generate a metadata json file for each page
        //.use(writemetadata({
        //    pattern: ["**/*.html"],
        //    ignorekeys: ["next", "contents", "previous"],
        //    bufferencoding: "utf8"
        //}))

        .use(assets({
            "source": assetPath,
            "destination": assetDest
        }))

        .build(function (err) {
            if (err) {
                return callback(err);
            }
            callback();
        });
}

gulp.task("metalsmith", (callback) => setUpMS(callback));

// compile style sheet for dev
gulp.task("styles", function () {
    "use strict";
    return gulp.src(path.join(__dirname, stylePath, "main.scss"))
        .pipe(sourcemaps.init())
        .pipe(sass({style: "expanded"}))
        .pipe(autoprefixer("last 2 version"))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.join(__dirname, assetPath, "assets/styles")));
});

// compile vendor scripts
gulp.task("vendorScripts", function () {
    "use strict";
    return gulp.src([
        "node_modules/jquery/dist/jquery.js",
        "node_modules/jquery.easing/jquery.easing.js",
        "node_modules/jquery-hoverintent/jquery.hoverIntent.js"
    ])
        .pipe(concat("vendors.min.js"))
        .pipe(compressJS())
        .pipe(gulp.dest(path.join(__dirname, assetPath, "assets/scripts")));
});

// compile scripts for dev
gulp.task("scripts", function () {
    "use strict";
    return gulp.src(path.join(__dirname, scriptPath, "**/*.js"))
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ["es2015"]
        }))
        .pipe(order([
            path.join(__dirname, scriptPath, "ready.js"),
            path.join(__dirname, scriptPath, "modules/**.js")
        ]))
        .pipe(concat("main.js"))
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest(path.join(__dirname, assetPath, "assets/scripts")));
});

// we are using custom icon fonts from icomoon. They are located in folder './icons'
// the next three tasks move the icon files into 'src/sources/assets/fonts' and the 
// two style files 'variables.scss' and 'style.scss' into 'src/styles/icons'
gulp.task("getIcons", function () {
    "use strict";
    return gulp.src(path.join(__dirname, iconPath, "fonts/**.*"))
        .pipe(gulp.dest(path.join(__dirname, assetPath, "assets/styles/fonts")));
});
gulp.task("getIconStyles", function () {
    "use strict";
    return gulp.src(path.join(__dirname, iconPath, "style.scss"))
        .pipe(gulp.dest(path.join(__dirname, stylePath, "icons")));
});
gulp.task("getIconVariables", function () {
    "use strict";
    return gulp.src(path.join(__dirname, iconPath, "variables.scss"))
        .pipe(gulp.dest(path.join(__dirname, stylePath, "icons")));
});


// build the dev instance. styles and script files will have source mapos embedded for debugging
// we first build all site assets and then call metalsmith to assemble the site
// since gulp processes tasks in parallel we'll use the gulp plugin gulp-sequence
// sequence will process all tasks serially except the one in square bracket, these will be processed in parallel
// this insures that all site assets are ready before metallsmith assembles the site.
gulp.task("buildDev", (cb) => sequence(
    "getIconVariables",
    "getIconStyles",
    "getIcons",
    [
        "styles",
        "vendorScripts",
        "scripts"
    ],
    "metalsmith",
    cb
));

// having buildDev as a dependency for the refresh task insures that they are executed before browerSync is run
// reference: browsersync.io/docs/gulp
gulp.task("refresh", ["buildDev"], function (done) {
    "use strict";
    browserSync.reload();
    done();
});

// the gulp default task starts browserSync and the watch task
gulp.task("default", ["buildDev"], function () {
    "use strict";
    browserSync.init({
        server: {
            baseDir: "build"
        },
        open: false
    });

    gulp.watch([
        srcPath + "**/*",
        stylePath + "**/*",
        scriptPath + "**/*"
    ], ["refresh"]);
});

gulp.task('buildProd', function (cb) {
    'use strict';
    sequence([
        'vendorScripts',
        'productionScripts',
        'productionStyles'
    ],
        'metalsmith',
        cb
        );
});

gulp.task('productionScripts', function () {
    'use strict';
    return gulp.src(path.join(__dirname, scriptPath, '**/*.js'))
        .pipe(babel())
        .pipe(concat('main.js'))
        .pipe(gulp.dest(path.join(__dirname, assetPath, 'assets/scripts')));
});

// compile style sheet for development
gulp.task('productionStyles', function () {
    'use strict';

    return gulp.src(path.join(__dirname, stylePath, 'main.scss'))
        .pipe(sass({style: 'compressed'}))
        .pipe(autoprefixer('last 2 version'))
        .pipe(gulp.dest(path.join(__dirname, assetPath, 'assets/styles')));
});