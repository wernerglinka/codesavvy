/*jslint es6, this:true*/
/*global jQuery, YT, window*/

// function to play inline youTube videos
// allows videos to be inserted with minimal html
// example: "<div class="inline-video" data-video-tn="<path/to/img>" data-video-id="<youtube id>" data-start-time="10" data-end-time="140"></div>

let inlineVideos = (function ($, undefined) {
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

    let init = function () {
        // add all videos to the DOM
        allVideos.each(function (i) {
            let thisVideo = $(this);
            let thisVideoIndex = i;
            // add the thumbnail
            let thisVideoTnHTML = `<div class='video-tn'><i class='icon icon-play'></i><img src='${thisVideo.data("video-tn")}' alt='' /></div>`;
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
                    autoplay: 0,                    // start/stop via js commands
                    start: startTime || null,       // if no start or end time is specified go trom 0 to end
                    end: endTime || null,
                    controls: 1,                    // show video controls
                    enablejsapi: 1,                 // enable the js api so we can control then player with js
                    wmode: 'opaque',                // allow other elements to cover video, e.g. dropdowns or pop-ups
                    origin: window.location.origin, // prevent "Failed to execute 'postMessage' on 'DOMWindow'" error
                    rel: 0                          // disable other video suggestions after video end
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
}(jQuery));