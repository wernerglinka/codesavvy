/*jsLint es6, this */
/*global jQuery, window */

// the scroll to top function for long pages
let getNews = (function ($, undefined) {
    "use strict";

    let init = function () {
        let sheetID = "1gT2DHawm3ZlcqfzP40Wy9w2WgWF_bbe2-_751BGOpag";
        let sheetURL = `https://spreadsheets.google.com/feeds/list/${sheetID}/1/public/values?alt=json`;

        $.getJSON(sheetURL, function (data) {
            // loop over all news and prepare news list
            
            
            console.log(data.feed.entry);
        });


    };
    return {
        init: init
    };
}(jQuery));