/*jsLint es6 */
/*global YT, jQuery, window, setInterval, clearInterval */

// function to scroll softly to on-page anchors
const softScroll = (function ($) {
    'use strict';

    // filter handling for a /dir/ OR /indexordefault.page
    var filterPath = function (string) {
        return string
            .replace(/^\//, '')
            .replace(/(index|default).[a-zA-Z]{3,4}$/, '')
            .replace(/\/$/, '');
    };

    var init = function () {
        // source: https://css-tricks.com/smooth-scrolling-accessibility/
        // URL updates and the element focus is maintained
        // originally found via in Update 3 on http://www.learningjquery.com/2007/10/improved-animated-scrolling-script-for-same-page-links
        //
        // the code from css-tricks has an obscure bug that causes urls of the form https://caniuse.com/#search=requestAnimationFrame
        // to cause an jQuery error: Uncaught Error: Syntax error, unrecognized expression: #search=requestAnimationFrame
        // the error is caused by this selector $('a[href*="#"]') as this selector selects urls that have an "#" in any place
        // Changing that to $('a[href^="#"]') insures that only hashes that START with and "#" are selected.

        const locationPath = filterPath(location.pathname);
        $('a[href^="#"]').each(function () {
            const thisPath = filterPath(this.pathname) || locationPath;
            const hash = this.hash;
            if ($("#" + hash.replace(/#/, '')).length) {
                if (locationPath === thisPath && (location.hostname === this.hostname || !this.hostname) && this.hash.replace(/#/, '')) {
                    const $target = $(hash), target = this.hash;
                    if (target) {
                        $(this).on('click', function (event) {
                            event.preventDefault();
                            $('html, body').animate({
                                scrollTop: $target.offset().top - 100
                            }, 1000);
                        });
                    }
                }
            }
        });
    };

    return {
        init: init
    };
}(jQuery));
