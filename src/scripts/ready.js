/*jslint browser: true*/
/*global Event, jQuery, document, window, touchClick, externalLinks, scrollToTop, scrolledIntoView, softScroll, hamburger, showLogo, accordions, calendar, upcomingEvents, getNews */

(function ($) {
    'use strict';

    $(function () {
        touchClick.init();
        externalLinks.init();
        scrollToTop.init();
        scrolledIntoView.init();
        softScroll.init();
        hamburger.init();
        if ($('body').hasClass('home')) {
            showLogo.init();
        }

        accordions.init();

        if ($('body').hasClass('calendar')) {
            calendar.init();
        }
        if ($('body').hasClass('home')) {
            upcomingEvents.init();
        }

        getNews.init();
    });
    // end ready function
}(jQuery));


