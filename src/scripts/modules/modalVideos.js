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


let modalVideos = (function ($, undefined) {
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
            thisTrigger
                .attr('href', thisTrigger.data('video-link'))
                .removeAttr('data-video-link')
                .removeAttr('disabled');

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
                start: startTime || null,       // if no start or end time is specified go trom 0 to end
                end: endTime || null,                   // start/stop via js commands
                controls: 1,                    // show video controls
                enablejsapi: 1,                 // enable the js api so we can control then player with js
                wmode: 'opaque',                // allow other elements to cover video, e.g. dropdowns or pop-ups
                origin: window.location.origin, // prevent "Failed to execute 'postMessage' on 'DOMWindow'" error
                rel: 0                          // disable other video suggestions after video end
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
}(jQuery));