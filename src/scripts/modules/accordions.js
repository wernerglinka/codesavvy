/*jsLint es6, this */
/*global jQuery, window */

// function to manage top nav visibility
let accordions = (function ($) {
    'use strict';

    let init = function () {
        let allAccordions = $('.accordion');

        allAccordions.each(function () {
            let thisAccordion = $(this);
            let theseAccordionHeads = thisAccordion.find('.accordion-head');

            theseAccordionHeads.on('touchclick', function () {
                let thisAccordionHead = $(this);
                
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
}(jQuery));