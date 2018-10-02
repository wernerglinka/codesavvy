/*jsLint es6 */
/*global jQuery, window */

// function to manage top nav visibility
let showLogo = (function ($) {
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
}(jQuery));