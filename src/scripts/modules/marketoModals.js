/*jsLint es6, this: true */
/*global YT, jQuery, window */

let marketoModal = (function ($) {
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
}(jQuery));