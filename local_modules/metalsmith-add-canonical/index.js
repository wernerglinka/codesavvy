/*jslint es6*/
/*global module, metalsmith */

"use strict";

// this plugin can be used with permalinks to build the canonical url for a page.
// this might depend on what version of metalsmith-in-place is used?

module.exports = function addCanonical(options) {

    return function plugin(files, metalsmith, done) {
        const metadata = metalsmith.metadata();
        const defaults = {
            hostname: metadata.site.url,
            fileExt: ".njk"
        };
        const settings = Object.assign({}, defaults, options);

        try {
            Object.keys(files).forEach(function (file) {
                // remove the file ext
                let tempFilePath = file.substring(0, file.lastIndexOf(settings.fileExt));

                let canonicalFilePath = "";
                if (tempFilePath === "index") {
                    canonicalFilePath = settings.hostname;
                } else {
                    canonicalFilePath = settings.hostname + "/" + tempFilePath;
                }
                files[file].canonicalURL = canonicalFilePath;
            });
            done();
        } catch (e) {
            done(e);
        }
    };
};
