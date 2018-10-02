/*jsLint es6 */
/*global jQuery, window */

// function to attach a class to the body element when the hamburger is touched/clicked
const hamburger = (function ($) {
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
}(jQuery));