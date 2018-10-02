/*jslint browser: true*/
/*global Event, jQuery, document, window, touchClick, externalLinks, scrollToTop, scrolledIntoView, softScroll, hamburger, showLogo, accordions */

(function ($) {
    'use strict';

    $(function () {
        touchClick.init();
        externalLinks.init();
        scrollToTop.init();
        scrolledIntoView.init();
        softScroll.init();
        hamburger.init();
        showLogo.init();
        accordions.init();
    });
    // end ready function
}(jQuery));


