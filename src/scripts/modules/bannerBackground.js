/*jslint browser: true*/
/*global jQuery, undefined, window */

// function for change nav background opacity when banner is scrolled up
var bannerBackground = (function ($, undefined) {
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

}(jQuery));