/*jslint es6*/
/*global jQuery, window*/

var scrolledIntoView = (function ($, undefined) {
    "use strict";

    let init = function () {
        let animateWhenInView = $('.initial');

        $(window).scroll(function (){

            if (animateWhenInView.length) {
                animateWhenInView.each(function () {
                    let thisElement = $(this);

                    if(intoView(thisElement) && thisElement.hasClass('initial')) {
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
        return ((elementTop <= docViewBottom) && (elementTop >= docViewTop));
    };

    return {
        init: init
    };
}(jQuery));
