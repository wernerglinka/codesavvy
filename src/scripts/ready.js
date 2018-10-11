/*jslint browser: true*/
/*global Event, jQuery, document, window, touchClick, externalLinks, scrollToTop, scrolledIntoView, softScroll, hamburger, showLogo, accordions, calendar, upcomingEvents, getNews, inlineVideos */

(function ($) {
    'use strict';

    $(function () {
        touchClick.init();
        externalLinks.init();
        scrollToTop.init();
        scrolledIntoView.init();
        softScroll.init();
        hamburger.init();
        accordions.init();
        inlineVideos.init();

        if ($('body').hasClass('home')) {
            showLogo.init();
            upcomingEvents.init();
        }
        if ($('body').hasClass('calendar')) {
            calendar.init();
        }
        if ($('body').hasClass('news')) {
            getNews.init();
        }
    });
    // end ready function
}(jQuery));


