'use strict';

/*jsLint es6, this */
/*global jQuery, window */

// function to manage top nav visibility
var accordions = function ($) {
    'use strict';

    var init = function init() {
        var allAccordions = $('.accordion');

        allAccordions.each(function () {
            var thisAccordion = $(this);
            var theseAccordionHeads = thisAccordion.find('.accordion-head');

            theseAccordionHeads.on('touchclick', function () {
                var thisAccordionHead = $(this);

                thisAccordionHead.parents('.accordion').find('.accordion-head').not(thisAccordionHead).removeClass('isOpen').next().slideUp();
                thisAccordionHead.toggleClass('isOpen');
                if (thisAccordionHead.hasClass('isOpen')) {
                    thisAccordionHead.next().slideDown();
                    thisAccordionHead.find('.icon').removeClass('icon-chevron-down').addClass('icon-chevron-up');
                } else {
                    thisAccordionHead.next().slideUp();
                    thisAccordionHead.find('.icon').removeClass('icon-chevron-up').addClass('icon-chevron-down');
                }
            });
        });
    };
    return {
        init: init
    };
}(jQuery);
'use strict';

/*jsLint es6, this */
/*global jQuery, window, moment */

// function to manage top nav visibility
var calendar = function ($) {
    'use strict';

    var init = function init() {
        // create the popup html
        var eventPopUpHTML = '<div id=\'event-details\' class=\'event-popup\'>\n                    <i class=\'icon icon-x\'></i>\n                    <ul class=\'list-unstyled event-data\'>\n                        <li class=\'event-title\'></li>\n                        <li><strong>Date:</strong> <span class=\'event-date\'></span></li>\n                        <li class=\'event-time\'><strong>Time:</strong> <span class=\'start-time\'></span> to <span class=\'end-time\'></span></li>\n                        <li class=\'event-description\'></li>\n                        <li><strong>Venue</strong><p class=\'event-location\'></p></li>\n                        <li class=\'event-map\'><a target=\'_blank\' class=\'event-map-link\' href=\'\'>+ Google Map</a></li>\n                    </ul>\n                </div>';

        // append the popup container to body  
        $('body').append($(eventPopUpHTML));

        var eventPopup = $('#event-details');

        // render calendar
        var thisCal = $('#calendar');
        thisCal.fullCalendar({
            googleCalendarApiKey: "AIzaSyAtfBMbq9zyxuelJG94mkvgUoBA58CF6P4",
            eventSources: [{ googleCalendarId: "kidscode@codesavvy.org",
                className: 'kids-code-event'
            }, { // get with the program calendar
                googleCalendarId: "codesavvy.org_6hbsd3g9j98tjclh328e5bji5c@group.calendar.google.com",
                className: 'get-with-the-program-event'
            }, { // northfield coderdojo calendar
                googleCalendarId: "codesavvy.org_kocktpkfeoq5ets7ueq6ahtq7g@group.calendar.google.com",
                className: 'northfield-coderdojo-event'
            }, { // rebecca coderdojo calendar
                googleCalendarId: "codesavvy.org_kq66e6mmrcgf470apc4i4sgrtc@group.calendar.google.com",
                className: 'rebecca-coderdojo-event'
            }, { // twin cities coderdojo calendar
                googleCalendarId: "codesavvy.org_qb9mb086pvdeaj3a0vrsgtq3uo@group.calendar.google.com",
                className: 'tc-coderddojo-event'
            }, { // technovation[mn] calendar
                googleCalendarId: "codesavvy.org_vtbr9o2dmjm152b0e9peaotl1s@group.calendar.google.com",
                className: 'technovation-mn-event'
            }, { // google holidays calendar
                googleCalendarId: "en.usa#holiday@group.v.calendar.google.com",
                className: 'calendar-holidays'
            }],
            eventClick: function eventClick(calEvent, jsEvent, view) {
                jsEvent.preventDefault();

                // ignore holidays
                if ($(this).hasClass('calendar-holidays')) {
                    return;
                }

                var date = moment(new Date(calEvent.start)).format("MMMM Do, YYYY");
                var startTime = moment(new Date(calEvent.start)).format("LT");
                var endTime = moment(new Date(calEvent.end)).format("LT");
                var locationQueryTerm = calEvent.location.replace(/,/g, '%20');
                var mapLink = 'https://www.google.com/maps/search/?api=1&query=' + locationQueryTerm;

                eventPopup.find('.event-title').html(calEvent.title);
                eventPopup.find('.event-date').html(date);
                eventPopup.find('.start-time').html(startTime);
                eventPopup.find('.end-time').html(endTime);
                eventPopup.find('.event-description').html(calEvent.description);
                eventPopup.find('.event-location').html(calEvent.location);
                eventPopup.find('.event-map-link').attr('href', mapLink);

                // show the modal box
                eventPopup.addClass('event-details_active');
            }
        });
        var viewStatus = "grid";
        if ($(window).width() < 768) {
            thisCal.fullCalendar('changeView', 'listMonth');
            viewStatus = "list";
        }

        $(window).on('resize', function () {
            if ($(window).width() < 768 && viewStatus === "grid") {
                thisCal.fullCalendar('changeView', 'listMonth');
                viewStatus = "list";
            }
            if ($(window).width() >= 768 && viewStatus === "list") {
                thisCal.fullCalendar('changeView', 'month');
                viewStatus = "grid";
            }
        });

        // close the event popup
        eventPopup.find('.icon-x').on('touchclick', function () {
            $(this).parent().removeClass('event-details_active');
        });
    };
    return {
        init: init
    };
}(jQuery);
"use strict";

/*jslint browser: true, this: true*/
/*global jQuery, undefined, window */

// function to add "target='_blank'" to all external links
var externalLinks = function ($, undefined) {
    "use strict";

    var allExternalLinks = $('a[href^="http://"], a[href^="https://"]');
    var init = function init() {
        allExternalLinks.each(function () {
            var thisExternalLink = $(this);
            thisExternalLink.attr("target", "_blank");
        });
    };
    return {
        init: init
    };
}(jQuery);
"use strict";

/*jsLint es6, this */
/*global jQuery, window */

// the scroll to top function for long pages
var getNews = function ($, undefined) {
    "use strict";

    var init = function init() {
        var sheetID = "1FqD-0CJeg-EyMn8NDWCyAY4LtodSnN2qGTS2Re3zEmg";
        var sheetURL = "https://spreadsheets.google.com/feeds/list/" + sheetID + "/1/public/values?alt=json";
        var lastYear = void 0;

        $.getJSON(sheetURL, function (data) {
            // loop over all news and prepare news list
            var newsList = $('#code-savvy-news-list');
            Object.values(data.feed.entry).forEach(function (thisNews) {
                // a little help from: https://gist.github.com/claytongulick/bf05ecebe7a2bbb96b585b74af203eed
                // about if in string template literals
                var date = moment(thisNews.gsx$date.$t, 'MM-DD-YYYY');
                var thisDay = date.format('DD');
                var thisMonth = date.format('MMM');
                var thisYear = date.format('YYYY');
                var newsItemHTML = "";

                if (thisYear !== lastYear) {
                    newsItemHTML = "<li class=\"year-header\">" + thisYear + "</li>";
                    lastYear = thisYear;
                }

                newsItemHTML += "\n                    <li>\n                        <div class=\"news-date\">\n                            <span class=\"news-date_day\">" + thisDay + "</span><span class=\"news-date_month\">" + thisMonth + "</span>\n                        </div>\n                        <div class=\"news-details\">\n                            <p class=\"news-org\">" + thisNews.gsx$newsorg.$t + "</p>\n                            " + function (gsx$newslink) {
                    if (gsx$newslink.$t.length) {
                        return "<a href=\"" + thisNews.gsx$newslink.$t + "\">" + thisNews.gsx$title.$t + "</a>";
                    } else {
                        return "<p>" + thisNews.gsx$title.$t + "</p>";
                    }
                }(thisNews.gsx$newslink) + "\n                        </div>\n                    </li>";
                newsList.append(newsItemHTML);
            });
        });
    };
    return {
        init: init
    };
}(jQuery);
'use strict';

/*jsLint es6 */
/*global jQuery, window */

// function to attach a class to the body element when the hamburger is touched/clicked
var hamburger = function ($) {
    'use strict';

    var init = function init() {
        var thisPage = $('body');
        var hamburger = $('.hamburger');
        var thisMenuLayer = $('.navigation').find('ul');

        hamburger.on('click', function () {
            if (thisPage.hasClass('navActive')) {
                thisPage.removeClass('navActive');
                thisMenuLayer.fadeOut();
            } else {
                thisMenuLayer.fadeIn();
                thisPage.addClass('navActive');
            }
        });

        // hide nav menu after selection and when scrolling
        thisMenuLayer.find('>li').on('click', function () {
            thisPage.removeClass('navActive');
            thisMenuLayer.fadeOut();
        });
        $(window).on('scroll', function () {
            thisPage.removeClass('navActive');
            thisMenuLayer.fadeOut();
        });
    };

    return {
        init: init
    };
}(jQuery);
"use strict";

/*jslint es6, this:true*/
/*global jQuery, YT, window*/

// function to play inline youTube videos
// allows videos to be inserted with minimal html
// example: "<div class="inline-video" data-video-tn="<path/to/img>" data-video-id="<youtube id>" data-start-time="10" data-end-time="140"></div>

var inlineVideos = function ($, undefined) {
    "use strict";

    var allVideos = $(".inline-video");
    var allPlayers = [];

    // initialize all video links when the player is ready
    var initVideoLinks = function initVideoLinks() {

        allVideos.each(function (i) {
            var thisTrigger = $(this);

            thisTrigger.on('click', function () {
                allPlayers[i].playVideo();
            });
        });
    };

    var onPlayerStateChange = function onPlayerStateChange(event) {

        // player states
        // "unstarted"               = -1
        // YT.PlayerState.ENDED      =  0
        // YT.PlayerState.PLAYING    =  1
        // YT.PlayerState.PAUSED     =  2
        // YT.PlayerState.BUFFERING  =  3
        // YT.PlayerState.CUED       =  5

        switch (event.data) {
            case YT.PlayerState.PAUSED:
                $(event.target.a.parentElement).fadeOut();
                $(event.target.a.parentElement).prev().fadeIn();
                break;

            case YT.PlayerState.PLAYING:
                break;

            case YT.PlayerState.ENDED:
                $(event.target.a.parentElement).fadeOut();
                $(event.target.a.parentElement).prev().fadeIn();
                break;

            case YT.PlayerState.CUED:
                break;
        }
    };

    var init = function init() {
        // add all videos to the DOM
        allVideos.each(function (i) {
            var thisVideo = $(this);
            var thisVideoIndex = i;
            // add the thumbnail
            var thisVideoTnHTML = "<div class='video-tn'><i class='icon icon-play'></i><img src='" + thisVideo.data("video-tn") + "' alt='' /></div>";
            thisVideo.append(thisVideoTnHTML);
            // and the video
            var thisVideoHTML = "<div class='video-wrapper'><div id='linearVideo" + thisVideoIndex + "'></div></div>";
            thisVideo.append(thisVideoHTML);
        });

        // initialize all video players on a page
        // videoAPIReady is a custom event triggered when the Youtube API has been loaded
        $(window).on("videoAPIReady", function () {
            allVideos.each(function (i) {
                var videoID = allVideos.eq(i).data('video-id');
                var startTime = allVideos.eq(i).data('start-time');
                var endTime = allVideos.eq(i).data('end-time');
                var videoTarget = "linearVideo" + i;

                // reference https://developers.google.com/youtube/player_parameters?playerVersion=HTML5
                var playerVars = {
                    autoplay: 0, // start/stop via js commands
                    start: startTime || null, // if no start or end time is specified go trom 0 to end
                    end: endTime || null,
                    controls: 1, // show video controls
                    enablejsapi: 1, // enable the js api so we can control then player with js
                    wmode: 'opaque', // allow other elements to cover video, e.g. dropdowns or pop-ups
                    origin: window.location.origin, // prevent "Failed to execute 'postMessage' on 'DOMWindow'" error
                    rel: 0 // disable other video suggestions after video end
                };

                // create the video player object
                allPlayers[i] = new YT.Player(videoTarget, {
                    videoId: videoID,
                    playerVars: playerVars,
                    events: {
                        'onReady': initVideoLinks,
                        'onStateChange': onPlayerStateChange
                    }
                });
            });

            // initially the video thumbnail is visible. on click fadeout the tn, show and play the video
            allVideos.each(function (i) {
                var thisVideo = $(this);
                thisVideo.find(".video-tn").on("click", function () {
                    var thisVideoTn = $(this);
                    thisVideoTn.fadeOut();
                    thisVideoTn.next().fadeIn();
                    allPlayers[i].playVideo();
                });
            });
        });
    };

    return {
        init: init
    };
}(jQuery);
"use strict";

/*jsLint es6 */
/*global YT, jQuery, window, setInterval, clearInterval */

// reference: https://developers.google.com/youtube/iframe_api_reference
// useful tutorial: https://tutorialzine.com/2015/08/how-to-control-youtubes-video-player-with-javascript

// implements the YouTube iFrame API to display multiple videos - one-at-the-time - in a modal overlay.
// page must have body class hasVideo
// page may have multiple video links "<a class="modal-video" data-video-link="https://youtu.be/30sorJ54rdM" data-video-id="30sorJ54rdM"  data-video-attr="" disabled>Test Video Link 1</a>"
// initially, video links do not have "href" attribute but have attribute "disabled"
// once the api has been loaded and is ready to play videos all links are activated by adding "href" attribute and removing "disabled" attribute
// the video object is given the first videoID. Videos will be played, after the overlay is active, by calling either videoPlay() when the video has been loaded
// or by loadVideoById() when a new video is requested
// when closing the overlay, the video sound is faded out prior to videoPause(). Do not use videoStop() as that produces strange transitions, e.g. before a 
// new video starts, a few frames of the prior video might be visible. API docs recommend to use videoPause().


var modalVideos = function ($, undefined) {
    "use strict";

    var modalVideoTriggers = $(".modal-video");
    var player = void 0;
    var videoOverlay = void 0;

    // initialize all video links when the player is ready
    var initVideoLinks = function initVideoLinks() {
        videoOverlay = $('#video-overlay');
        var closeVideoOverlay = videoOverlay.find('.icon-x');

        modalVideoTriggers.each(function () {
            var thisTrigger = $(this);
            var requestedVideoID = thisTrigger.data('video-id');
            var startTime = thisTrigger.data('start-time');
            var endTime = thisTrigger.data('end-time');

            // turn data-video-link into a href attribute and remove disabled attribute
            thisTrigger.attr('href', thisTrigger.data('video-link')).removeAttr('data-video-link').removeAttr('disabled');

            thisTrigger.on('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                videoOverlay.fadeIn(400);

                // load the appropriate video ID
                // if the requested videoID is equal to what the player has already loaded
                // then just play the video else load the new video and then play it
                if (requestedVideoID === player.getVideoEmbedCode()) {
                    player.playVideo();
                } else {
                    player.loadVideoById({
                        videoId: requestedVideoID,
                        startSeconds: startTime || null,
                        endSeconds: endTime || null
                    });
                }
                // we might have muted a previous video. set the default level
                player.setVolume(50);
            });
        });

        closeVideoOverlay.on('click', function () {
            // fadeout sound as we close the overlay
            var currentVolume = player.getVolume();
            var fadeout = setInterval(function () {
                if (currentVolume <= 0) {
                    // use pauseVideo rather than stopVideo to minimize
                    // previous video flashes when starting the new video
                    player.pauseVideo();
                    clearInterval(fadeout);
                }
                currentVolume = currentVolume - 5;
                player.setVolume(currentVolume);
            }, 100);
            videoOverlay.fadeOut();
        });
    };

    var onPlayerStateChange = function onPlayerStateChange(event) {
        videoOverlay = $('#video-overlay');

        // player states
        // "unstarted"               = -1
        // YT.PlayerState.ENDED      =  0
        // YT.PlayerState.PLAYING    =  1
        // YT.PlayerState.PAUSED     =  2
        // YT.PlayerState.BUFFERING  =  3
        // YT.PlayerState.CUED       =  5

        switch (event.data) {
            case YT.PlayerState.PAUSED:
                break;

            case YT.PlayerState.PLAYING:
                break;

            case YT.PlayerState.ENDED:
                videoOverlay.fadeOut();
                break;

            case YT.PlayerState.CUED:
                break;
        }
    };

    var init = function init() {
        if (!$("body").hasClass("hasVideo")) {
            return;
        }

        // on videoAPIReady we add a video overlay and create a video player in div#ytvideo
        $(window).on("videoAPIReady", function () {

            // create an video overlay
            $("body").append("\n            <div id=\"video-overlay\" class=\"video-overlay\">\n                <i class=\"icon icon-x\"></i>\n                <div class=\"responsive-wrapper\">\n                    <div class=\"video-container\">\n                        <div id=\"ytvideo\"></div>\n                    </div>\n                </div>\n            </div>");

            videoOverlay = $('#video-overlay');
            var videoID = modalVideoTriggers.eq(0).data('video-id'); // the first video link
            var startTime = modalVideoTriggers.eq(0).data('start-time');
            var endTime = modalVideoTriggers.eq(0).data('end-time');

            // reference https://developers.google.com/youtube/player_parameters?playerVersion=HTML5
            var playerVars = {
                autoplay: 0,
                start: startTime || null, // if no start or end time is specified go trom 0 to end
                end: endTime || null, // start/stop via js commands
                controls: 1, // show video controls
                enablejsapi: 1, // enable the js api so we can control then player with js
                wmode: 'opaque', // allow other elements to cover video, e.g. dropdowns or pop-ups
                origin: window.location.origin, // prevent "Failed to execute 'postMessage' on 'DOMWindow'" error
                rel: 0 // disable other video suggestions after video end
            };

            // create the video player object
            player = new YT.Player('ytvideo', {
                videoId: videoID,
                playerVars: playerVars,
                events: {
                    'onReady': initVideoLinks,
                    'onStateChange': onPlayerStateChange
                }
            });
        });
    };

    return {
        init: init
    };
}(jQuery);
'use strict';

/*jslint es6*/
/*global jQuery, window*/

var scrolledIntoView = function ($, undefined) {
    "use strict";

    var init = function init() {
        var animateWhenInView = $('.initial');

        $(window).scroll(function () {

            if (animateWhenInView.length) {
                animateWhenInView.each(function () {
                    var thisElement = $(this);

                    if (intoView(thisElement) && thisElement.hasClass('initial')) {
                        thisElement.removeClass('initial');
                    }
                });
            }
        });
    };

    var intoView = function intoView(element) {
        var docViewTop = $(window).scrollTop();
        var docViewBottom = docViewTop + $(window).height();
        var elementTop = $(element).offset().top;
        return elementTop <= docViewBottom && elementTop >= docViewTop;
    };

    return {
        init: init
    };
}(jQuery);
"use strict";

/*eslint no-unused-vars: 0*/

// the scroll to top function for long pages
var scrollToTop = function ($, undefined) {
    var hasToTop = $("#toTop").length;
    var toTop = $("#toTop");
    var TO_TOP_VISIBLE = 400;

    var init = function init() {
        if (hasToTop) {
            toTop.on("touchclick", function () {
                $("html, body").animate({
                    scrollTop: 0
                }, 500, "easeOutCubic");
                return false;
            });
            // hide scroll icon if content is at top already
            // normally we would check for $(window).scrollTop() but IE8 always return 0, what else is new
            if ($("body").scrollTop() < TO_TOP_VISIBLE && $("html").scrollTop() < TO_TOP_VISIBLE) {
                $("#toTop").hide();
            }
            // update scroll icon if window is resized
            $(window).resize(function () {
                if ($("body").scrollTop() < TO_TOP_VISIBLE && $("html").scrollTop() < TO_TOP_VISIBLE) {
                    $("#toTop").hide();
                }
            });
            // manage scroll icon when scrolling
            $(window).scroll(function () {
                if ($("body").scrollTop() < TO_TOP_VISIBLE && $("html").scrollTop() < TO_TOP_VISIBLE) {
                    $("#toTop").fadeOut(400);
                } else {
                    $("#toTop").fadeIn(400);
                }
            });
        }
    };

    return {
        init: init
    };
}(jQuery);
'use strict';

/*jsLint es6 */
/*global jQuery, window */

// function to manage top nav visibility
var showLogo = function ($) {
    'use strict';

    var init = function init() {
        var welcomeScreenMain = $('.welcome-screen__bg-image');
        var showLogoEdge = 500;
        var logo = $('#logo');

        $(window).on('scroll', function () {
            //if scrollTop is >= what-i-do section we'll show the topNav
            if ($(document).scrollTop() >= showLogoEdge) {
                if (logo.is(':hidden')) {
                    logo.fadeIn();
                }
            } else if (!logo.is(':hidden')) {
                logo.fadeOut();
            }
        });
    };
    return {
        init: init
    };
}(jQuery);
'use strict';

/*jsLint es6 */
/*global YT, jQuery, window, setInterval, clearInterval */

// function to scroll softly to on-page anchors
var softScroll = function ($) {
    'use strict';

    // filter handling for a /dir/ OR /indexordefault.page

    var filterPath = function filterPath(string) {
        return string.replace(/^\//, '').replace(/(index|default).[a-zA-Z]{3,4}$/, '').replace(/\/$/, '');
    };

    var init = function init() {
        // source: https://css-tricks.com/smooth-scrolling-accessibility/
        // URL updates and the element focus is maintained
        // originally found via in Update 3 on http://www.learningjquery.com/2007/10/improved-animated-scrolling-script-for-same-page-links
        //
        // the code from css-tricks has an obscure bug that causes urls of the form https://caniuse.com/#search=requestAnimationFrame
        // to cause an jQuery error: Uncaught Error: Syntax error, unrecognized expression: #search=requestAnimationFrame
        // the error is caused by this selector $('a[href*="#"]') as this selector selects urls that have an "#" in any place
        // Changing that to $('a[href^="#"]') insures that only hashes that START with and "#" are selected.

        var locationPath = filterPath(location.pathname);
        $('a[href^="#"]').each(function () {
            var thisPath = filterPath(this.pathname) || locationPath;
            var hash = this.hash;
            if ($("#" + hash.replace(/#/, '')).length) {
                if (locationPath === thisPath && (location.hostname === this.hostname || !this.hostname) && this.hash.replace(/#/, '')) {
                    var $target = $(hash),
                        target = this.hash;
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
}(jQuery);
"use strict";

/*jsLint es6 */
/*global YT, jQuery, window */

// function to extend jQuery event >> touchclick for touch and click
var touchClick = function ($, undefined) {
    "use strict";

    var init = function init() {
        var isMobile = false;
        if ($("html").hasClass("touch")) {
            isMobile = true;
        }
        //var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);
        var eventType = isMobile ? "touchstart" : "click";

        $.event.special.touchclick = {
            bindType: eventType,
            delegateType: eventType
        };
    };

    return {
        init: init
    };
}(jQuery);
"use strict";

/*jsLint es6, this: true */
/*global jQuery, window, moment */

// the scroll to top function for long pages
var upcomingEvents = function ($, undefined) {
    "use strict";

    var buildEventObj = function buildEventObj(event) {
        var date = moment(new Date(event.start.dateTime)).format("MMMM Do, YYYY");
        var temp = [];
        temp.date = moment(new Date(event.start.dateTime)).format("MMMM Do, YYYY");
        temp.title = event.summary;
        temp.startTime = moment(new Date(event.start.dateTime)).format("LT");
        temp.endTime = moment(new Date(event.end.dateTime)).format("LT");
        temp.location = event.location;
        var locationQueryTerm = event.location.replace(/,/g, '%20');
        temp.mapLink = "https://www.google.com/maps/search/?api=1&query=" + locationQueryTerm;
        return temp;
    };

    var init = function init() {
        // get the 4 next events and see if we have multiple for the next event day
        // prepare a info pane that is shown when user clicks the event title
        // this way, when we have multiple events on the next events day, we can show them all
        /*
        let calID = [
            "codesavvy.org_qb9mb086pvdeaj3a0vrsgtq3uo@group.calendar.google.com", // CoderDojo TC
            "codesavvy.org_6hbsd3g9j98tjclh328e5bji5c@group.calendar.google.com", // get with the program
            "codesavvy.org_kocktpkfeoq5ets7ueq6ahtq7g@group.calendar.google.com", // northfield coderdojo
            "codesavvy.org_kq66e6mmrcgf470apc4i4sgrtc@group.calendar.google.com", // rebecca coderdojo
            "codesavvy.org_vtbr9o2dmjm152b0e9peaotl1s@group.calendar.google.com", // technovation[mn]
            "kidscode@codesavvy.org" // kids code
        ];
        */
        var calID = "kidscode@codesavvy.org"; // kids code
        var calKey = "AIzaSyAtfBMbq9zyxuelJG94mkvgUoBA58CF6P4";
        var calOptions = "&singleEvents=true&orderBy=starttime&maxResults=4";
        var calURL = "https://www.googleapis.com/calendar/v3/calendars/" + calID + "/events?key=" + calKey + calOptions;
        var nextEvents = [];
        var date = void 0,
            nextEvent = void 0,
            eventDetails = void 0;

        // get five calendar events, consolidate into one array and then find the next one(s)


        $.getJSON(calURL, function (data) {
            // get the date for the first event
            var nextDay = moment(new Date(data.items[0].start.dateTime)).format("MMMM Do, YYYY");
            // loop over the events and check if we have more events for the first event day
            Object.values(data.items).forEach(function (thisEvent) {
                date = moment(new Date(thisEvent.start.dateTime)).format("MMMM Do, YYYY");
                if (nextDay === date) {
                    nextEvents.push(buildEventObj(thisEvent));
                }
            });

            // now array nextEvents hold all event objects for the next events day
            // typically that is only 1 event

            var events = $("#upcoming-events");
            nextEvent = $("#next-event");
            var eventsDate = $('#events-date');
            var today = moment(new Date()).format("MMMM Do, YYYY");
            var tomorrow = moment(new Date()).add(1, 'days').format("MMMM Do, YYYY");

            switch (nextEvents[0].date) {
                case today:
                    eventsDate.html("Today");
                    break;
                case tomorrow:
                    eventsDate.html("Tomorrow");
                    break;
                default:
                    eventsDate.html("On " + nextEvents[0].date);
            }

            nextEvents.forEach(function (thisEvent) {
                // add title link to Next Event section
                nextEvent.append("<li><a class=\"event-title learn-more-link\">" + thisEvent.title + "</a></li>");

                // add the events details pane
                eventDetails = "\n                    <div class=\"slidein\">\n                        <i class=\"icon icon-x\"></i>\n                        <h2>" + thisEvent.title + "</h2>\n                        <p><strong>Date:</strong> " + thisEvent.date + "</p>\n                        <p><strong>Time:</strong> " + thisEvent.startTime + " to " + thisEvent.endTime + "</p>\n                        <hr>\n                        <h3>Venue</h3> \n                        <p>" + thisEvent.location + "</p>\n                        <a target=\"_blank\" href=\"" + thisEvent.mapLink + "\">+ Google Map</a>\n                    </div>";
                events.find('.has-slidein').append(eventDetails);
            });

            // add event handler to events title to show event details when clicked
            var eventTitles = events.find('.event-title').on('touchclick', function () {
                var thisEventTrigger = $(this);
                var thisEventIndex = thisEventTrigger.index(eventTitles);

                thisEventTrigger.toggleClass('is-open');

                if (thisEventTrigger.hasClass('is-open')) {
                    events.find('.slidein').not(thisEventIndex).css('left', '110%');
                    thisEventTrigger.parent().siblings().find('.is-open').removeClass('is-open');
                    events.find('.slidein').eq(thisEventIndex).css('left', 0);
                } else {
                    events.find('.slidein').eq(thisEventIndex).css('left', '110%');
                }
            });

            events.find('.icon-x').on('touchclick', function () {
                events.find('.slidein').css('left', '110%');
                eventTitles.removeClass('is-open');
            });
        });
    };
    return {
        init: init
    };
}(jQuery);

/*
<li><h1 class="event-title"></h1></li>
<li><strong>Date:</strong> <span class='event-date'></span></li>
<li class='event-time'><strong>Time:</strong> <span class='start-time'></span> to <span class='end-time'></span></li>
<li class='event-description'></li>
<li><strong>Venue</strong><p class='event-location'></p></li>
<li class='event-map'><a target='_blank' class='event-map-link' href=''>+ Google Map</a></li>

*/
'use strict';

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
})(jQuery);
//# sourceMappingURL=main.js.map
