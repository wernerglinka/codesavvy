/*jslint es6*/
/*global module, metalsmith, monitor, console */

"use strict";

module.exports = function monitor() {
    return function plugin(files, metalsmith, done) {
        console.log(metalsmith.metadata());
        console.log(files);

        done();
    };
};