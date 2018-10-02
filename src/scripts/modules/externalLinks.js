/*jslint browser: true, this: true*/
/*global jQuery, undefined, window */

// function to add "target='_blank'" to all external links
var externalLinks = (function ($, undefined) {
    "use strict";
    let allExternalLinks = $('a[href^="http://"], a[href^="https://"]');
    let init = function () {
        allExternalLinks.each(function () {
            var thisExternalLink = $(this);
            thisExternalLink.attr("target", "_blank");
        });
    };
    return {
        init: init
    };
}(jQuery));