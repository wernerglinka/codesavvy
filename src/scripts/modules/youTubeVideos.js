/*jslint es6*/
/*global jQuery, YT, window*/

// function to play youTube videos
// allows videos to be inserted with minimal html
// example: "<div class="youtube-video" data-video-tn="<path/to/img>" data-video-id="<youtube id>" data-additional-attributes="?enablejsapi=1&rel=0"></div>
var youTubeVideos = (function ($, undefined) {
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
}(jQuery));