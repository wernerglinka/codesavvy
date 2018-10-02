/*jsLint es6 */
/*global YT, jQuery, window, setInterval, clearInterval */

// reference: https://developers.google.com/youtube/iframe_api_reference
// useful tutorial: https://tutorialzine.com/2015/08/how-to-control-youtubes-video-player-with-javascript

// implements the YouTube iFrame API to display a video background in a banner.
// page must have body class hasVideo
// initially, the video thumbnail is shown until the video has been loded
// once the api has been loaded the video object is given the videoID. The video will be played in a loop


let backgroundVideo = (function ($, undefined) {
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
                controls: 0,                    // show video controls
                enablejsapi: 1,                 // enable the js api so we can control then player with js
                wmode: 'opaque',                // allow other elements to cover video, e.g. dropdowns or pop-ups
                origin: window.location.origin, // prevent "Failed to execute 'postMessage' on 'DOMWindow'" error
                rel: 0,
                autoplay: 0                         // disable other video suggestions after video end
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
}(jQuery));