/*jslint browser: true*/
/*global Event, jQuery, document, window, touchClick, externalLinks, scrollToTop, scrolledIntoView, softScroll, hamburger, showLogo */

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
    });
    // end ready function
})(jQuery);
/*jslint browser: true*/
/*global jQuery, undefined, window */

// function for change nav background opacity when banner is scrolled up
var bannerBackground = function ($, undefined) {
    "use strict";

    var bannerHeight = $(".banner").height(),
        hasBanner = $(".has-page-banner").length,
        init = function () {
        if (hasBanner) {
            $(window).scroll(function () {
                var thisWindow = $(window),
                    thisHeader = $("header");
                if (thisWindow.scrollTop() >= bannerHeight && !thisHeader.hasClass("noOpacity")) {
                    thisHeader.addClass("noOpacity");
                }
                if (thisWindow.scrollTop() < bannerHeight && thisHeader.hasClass("noOpacity")) {
                    thisHeader.removeClass("noOpacity");
                }
            });
        }
    };

    return {
        init: init
    };
}(jQuery);
/*jslint browser: true, this: true*/
/*global jQuery, undefined, window */

// function to add "target='_blank'" to all external links
var externalLinks = function ($, undefined) {
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
}(jQuery);
/*jsLint es6 */
/*global jQuery, window */

// function to attach a class to the body element when the hamburger is touched/clicked
const hamburger = function ($) {
    'use strict';

    let init = function () {
        const thisPage = $('body');
        const hamburger = $('.hamburger');
        const thisMenuLayer = $('.navigation').find('ul');

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
/*jslint es6, this:true*/
/*global jQuery, YT, window*/

// function to play inline youTube videos
// allows videos to be inserted with minimal html
// example: "<div class="youtube-video" data-video-tn="<path/to/img>" data-video-id="<youtube id>" data-start-time="10" data-end-time="140"></div>

let inlineVideos = function ($, undefined) {
    "use strict";

    let allVideos = $(".inline-video");
    let allPlayers = [];

    // initialize all video links when the player is ready
    let initVideoLinks = function () {

        allVideos.each(function (i) {
            let thisTrigger = $(this);

            thisTrigger.on('click', function () {
                allPlayers[i].playVideo();
            });
        });
    };

    let onPlayerStateChange = function (event) {

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
                $(event.target.a.parentElement).fadeOut();
                $(event.target.a.parentElement).prev().fadeIn();
                break;

            case YT.PlayerState.CUED:
                break;
        }
    };

    let init = function () {
        // add all videos to the DOM
        allVideos.each(function (i) {
            let thisVideo = $(this);
            let thisVideoIndex = i;
            // add the thumbnail
            let thisVideoTnHTML = `<div class='video-tn'><img src='${thisVideo.data("video-tn")}' alt='' /></div>`;
            thisVideo.append(thisVideoTnHTML);
            // and the video
            let thisVideoHTML = `<div class='video-wrapper'><div id='linearVideo${thisVideoIndex}'></div></div>`;
            thisVideo.append(thisVideoHTML);
        });

        // initialize all video players on a page
        // videoAPIReady is a custom event triggered when the Youtube API has been loaded
        $(window).on("videoAPIReady", function () {
            allVideos.each(function (i) {
                let videoID = allVideos.eq(i).data('video-id');
                let startTime = allVideos.eq(i).data('start-time');
                let endTime = allVideos.eq(i).data('end-time');
                let videoTarget = "linearVideo" + i;

                // reference https://developers.google.com/youtube/player_parameters?playerVersion=HTML5
                let playerVars = {
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
                let thisVideo = $(this);
                thisVideo.find(".video-tn").on("click", function () {
                    let thisVideoTn = $(this);
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
/*jsLint es6, this: true */
/*global YT, jQuery, window */

let marketoModal = function ($) {
    'use strict';

    let init = function () {
        let marketoTriggers = $('.marketo-modal-trigger');
        let marketoFormContainer = $('.marketo-form-container');

        // load the Marketo Forms2 library
        $.getScript("//app-sj13.marketo.com/js/forms2/js/forms2.min.js");

        // on touchclick we open on overlay and load the form
        marketoTriggers.on('touchclick', function (e) {
            e.preventDefault();
            e.stopImmediatePropagation();

            let thisMarketoTrigger = $(this);
            let marketoFormTitle = thisMarketoTrigger.data('marketo-title');
            let marketoFormID = thisMarketoTrigger.data('marketo-id');
            let marketoTarget = `<div class="inner"><h2>${marketoFormTitle}</h2><form id='mktoForm_${marketoFormID}' class='clearfix'></form></div>`;

            marketoFormContainer.append(marketoTarget);

            MktoForms2.loadForm("//app-sjst.marketo.com", "785-UHP-775", marketoFormID, function (form) {

                // >>>>> NEED TO ADD A THANK YOU MESSAGE

                // add onSuccess callback
                form.onSuccess(function () {
                    // hide overlay after successful submission
                    marketoFormContainer.find('.inner').remove();
                    marketoFormContainer.fadeOut();
                    // return false to prevent redirection to thank you page
                    return false;
                });

                // add class so we can position the GDPR consent checkbox
                $('[for^="GDPR_Consent"]').parents('.mktoFormRow').addClass('gdpr-consent');

                // remove the external stylesheets
                let links = window.document.getElementsByTagName('link');
                $(links).each(function () {
                    let thisLinkElement = $(this);
                    let thisLinkURL = thisLinkElement.attr('href');
                    if (thisLinkURL.indexOf('marketo.com') > 1) {
                        thisLinkElement.remove();
                    }
                });
                // and the inline styles
                let marketoForms = $("[id*='mktoForm']");
                marketoForms.each(function () {
                    $(this).find('style').remove();
                });
                // and the style attributes
                marketoForms.each(function () {
                    $(this).removeAttr('style');
                    $(this).find('[style]').removeAttr('style');
                });

                marketoForms.each(function () {
                    let thisMarketoForm = $(this);
                    //thisMarketoForm.find('select').niceSelect();
                    thisMarketoForm.find(':checkbox').after("<i class='icon icon-checkmark'></i>");
                });

                marketoFormContainer.fadeIn();
            });
        });

        marketoFormContainer.find('.icon-x').on('touchclick', function () {
            let thisMarketoContainer = $(this).parent();
            thisMarketoContainer.find('.inner').remove();
            thisMarketoContainer.fadeOut();
        });
    };

    return {
        init: init
    };
}(jQuery);
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


let modalVideos = function ($, undefined) {
    "use strict";

    let modalVideoTriggers = $(".modal-video");
    let player;
    let videoOverlay;

    // initialize all video links when the player is ready
    let initVideoLinks = function () {
        videoOverlay = $('#video-overlay');
        let closeVideoOverlay = videoOverlay.find('.icon-x');

        modalVideoTriggers.each(function () {
            let thisTrigger = $(this);
            let requestedVideoID = thisTrigger.data('video-id');
            let startTime = thisTrigger.data('start-time');
            let endTime = thisTrigger.data('end-time');

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
            let currentVolume = player.getVolume();
            let fadeout = setInterval(function () {
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

    let onPlayerStateChange = function (event) {
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

    let init = function () {
        if (!$("body").hasClass("hasVideo")) {
            return;
        }

        // on videoAPIReady we add a video overlay and create a video player in div#ytvideo
        $(window).on("videoAPIReady", function () {

            // create an video overlay
            $("body").append(`
            <div id="video-overlay" class="video-overlay">
                <i class="icon icon-x"></i>
                <div class="responsive-wrapper">
                    <div class="video-container">
                        <div id="ytvideo"></div>
                    </div>
                </div>
            </div>`);

            videoOverlay = $('#video-overlay');
            let videoID = modalVideoTriggers.eq(0).data('video-id'); // the first video link
            let startTime = modalVideoTriggers.eq(0).data('start-time');
            let endTime = modalVideoTriggers.eq(0).data('end-time');

            // reference https://developers.google.com/youtube/player_parameters?playerVersion=HTML5
            let playerVars = {
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
/*eslint no-unused-vars: 0*/

// the scroll to top function for long pages
var scrollToTop = function ($, undefined) {
    let hasToTop = $("#toTop").length;
    let toTop = $("#toTop");
    const TO_TOP_VISIBLE = 400;

    let init = function () {
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
/*jslint es6*/
/*global jQuery, window*/

var scrolledIntoView = function ($, undefined) {
    "use strict";

    let init = function () {
        let animateWhenInView = $('.initial');

        $(window).scroll(function () {

            if (animateWhenInView.length) {
                animateWhenInView.each(function () {
                    let thisElement = $(this);

                    if (intoView(thisElement) && thisElement.hasClass('initial')) {
                        thisElement.removeClass('initial');
                    }
                });
            }
        });
    };

    let intoView = function (element) {
        var docViewTop = $(window).scrollTop();
        var docViewBottom = docViewTop + $(window).height();
        var elementTop = $(element).offset().top;
        return elementTop <= docViewBottom && elementTop >= docViewTop;
    };

    return {
        init: init
    };
}(jQuery);
/*jsLint es6 */
/*global jQuery, window */

// function to manage top nav visibility
let showLogo = function ($) {
    'use strict';

    let init = function () {
        let welcomeScreenMain = $('.welcome-screen__bg-image');
        let showLogoEdge = 500;
        let logo = $('#logo');

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
/*jsLint es6 */
/*global YT, jQuery, window, setInterval, clearInterval */

// function to scroll softly to on-page anchors
const softScroll = function ($) {
    'use strict';

    // filter handling for a /dir/ OR /indexordefault.page

    var filterPath = function (string) {
        return string.replace(/^\//, '').replace(/(index|default).[a-zA-Z]{3,4}$/, '').replace(/\/$/, '');
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
                    const $target = $(hash),
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
/*jsLint es6 */
/*global YT, jQuery, window */

// function to extend jQuery event >> touchclick for touch and click
let touchClick = function ($, undefined) {
    "use strict";

    let init = function () {
        let isMobile = false;
        if ($("html").hasClass("touch")) {
            isMobile = true;
        }
        //var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);
        let eventType = isMobile ? "touchstart" : "click";

        $.event.special.touchclick = {
            bindType: eventType,
            delegateType: eventType
        };
    };

    return {
        init: init
    };
}(jQuery);
/*jsLint es6 */
/*global YT, jQuery, window, setInterval, clearInterval */

// reference: https://developers.google.com/youtube/iframe_api_reference
// useful tutorial: https://tutorialzine.com/2015/08/how-to-control-youtubes-video-player-with-javascript

// implements the YouTube iFrame API to display a video background in a banner.
// page must have body class hasVideo
// initially, the video thumbnail is shown until the video has been loded
// once the api has been loaded the video object is given the videoID. The video will be played in a loop


let backgroundVideo = function ($, undefined) {
    "use strict";

    let player;

    let onPlayerReady = function (event) {
        //event.target.playVideo();
    };

    let onPlayerStateChange = function (event) {

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
                //event.target.playVideo();
                break;

            case YT.PlayerState.CUED:
                break;
        }
    };

    let init = function () {
        if (!$("body").hasClass("hasVideo")) {
            return;
        }

        let videoID = $('#video-background').data('video-id');

        // on videoAPIReady we add a video overlay and create a video player in div#ytvideo
        $(window).on("videoAPIReady", function () {

            // reference https://developers.google.com/youtube/player_parameters?playerVersion=HTML5
            let playerVars = {
                modestbranding: 1,
                showinfo: 0,
                controls: 0, // show video controls
                enablejsapi: 1, // enable the js api so we can control then player with js
                wmode: 'opaque', // allow other elements to cover video, e.g. dropdowns or pop-ups
                origin: window.location.origin, // prevent "Failed to execute 'postMessage' on 'DOMWindow'" error
                rel: 0,
                autoplay: 0 // disable other video suggestions after video end
            };

            // create the video player object
            player = new YT.Player('video-background-player', {
                videoId: videoID,
                playerVars: playerVars,
                events: {
                    'onReady': onPlayerReady,
                    'onStateChange': onPlayerStateChange
                }
            });
        });
    };

    return {
        init: init
    };
}(jQuery);
/*jslint es6*/
/*global jQuery, YT, window*/

// function to play youTube videos
// allows videos to be inserted with minimal html
// example: "<div class="youtube-video" data-video-tn="<path/to/img>" data-video-id="<youtube id>" data-additional-attributes="?enablejsapi=1&rel=0"></div>
var youTubeVideos = function ($, undefined) {
    "use strict";

    let allVideos = $(".youtube-video");

    let _getTnHTML = function (videoTn) {
        var videoHTML = "<div class='video-tn'>";
        videoHTML += "<img src='" + videoTn + "' alt='' />";
        videoHTML += "</div>";
        return videoHTML;
    };

    let _getVideoHTML = function (videoID, videoIndex, addAttr) {
        var videoHTML = "<div class='video-wrapper'>";
        var addAttributes = addAttr ? addAttr : "";
        videoHTML += "<iframe id='player" + videoIndex + "' src='https://www.youtube.com/embed/" + videoID + addAttributes + " frameborder='0'></iframe>";
        videoHTML += "</div>";
        return videoHTML;
    };

    let init = function () {
        let allPlayers = [];

        // add all videos to the DOM
        allVideos.each(function (i) {
            var thisVideo = $(this);
            var thisVideoIndex = i;
            // add the thumbnail
            var thisVideoTnHTML = _getTnHTML(thisVideo.data("video-tn"));
            thisVideo.append(thisVideoTnHTML);
            // and the video
            var thisVideoHTML = _getVideoHTML(thisVideo.data("video-id"), thisVideoIndex, thisVideo.data("additional-attributes"));
            thisVideo.append(thisVideoHTML);
        });

        // initialize all video players on a page
        // videoAPIReady is a custom event triggered when the Youtube API has been loaded
        $(window).on("videoAPIReady", function () {
            allVideos.each(function (i) {
                allPlayers[i] = new YT.Player("player" + i, {
                    events: {
                        "onStateChange": function (event) {
                            //if (event.data === YT.PlayerState.PAUSED) {}
                            //if (event.data == YT.PlayerState.PLAYING) {}
                            if (event.data == YT.PlayerState.ENDED) {
                                // get the player ID
                                var currentPlayer = $("#" + event.target.a.id);
                                var videoTn = currentPlayer.parent().prev();
                                currentPlayer.parent().fadeOut();
                                videoTn.fadeIn();
                            }
                        }
                    }
                });
            });

            // initially the video thumbnail is visible. on click fadeout the tn, show and play the video
            allVideos.each(function (i) {
                var thisVideo = $(this);
                thisVideo.find(".video-tn").on("touchclick", function () {
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