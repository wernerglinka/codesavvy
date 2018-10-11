/*jsLint es6, this */
/*global jQuery, window */

// the scroll to top function for long pages
let getNews = (function ($, undefined) {
    "use strict";

    let init = function () {
        let sheetID = "1FqD-0CJeg-EyMn8NDWCyAY4LtodSnN2qGTS2Re3zEmg";
        let sheetURL = `https://spreadsheets.google.com/feeds/list/${sheetID}/1/public/values?alt=json`;

        $.getJSON(sheetURL, function (data) {
            // loop over all news and prepare news list
            let newsList = $('#code-savvy-news-list');
            Object.values(data.feed.entry).forEach(function (thisNews) {
                // a little help from: https://gist.github.com/claytongulick/bf05ecebe7a2bbb96b585b74af203eed
                // about if in string template literals
                let newsItemHTML = `
                    <li>
                    <span class="news-date">${thisNews.gsx$date.$t}</span>
                    <span class="news-org">${thisNews.gsx$newsorg.$t}</span>
                    ${
                        (gsx$newslink => {
                            if (gsx$newslink.$t.length) {
                                return `<a href="${thisNews.gsx$newslink.$t}">${thisNews.gsx$title.$t}</a>`
                            } else {
                                return `<span>${thisNews.gsx$title.$t}</span>`
                            }
                        })(thisNews.gsx$newslink)
                    }
                    </li>`;
                    newsList.append(newsItemHTML);
            });
        });
    };
    return {
        init: init
    };
}(jQuery));