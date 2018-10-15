/*jsLint es6, this */
/*global jQuery, window */

// the scroll to top function for long pages
let getNews = (function ($, undefined) {
    "use strict";

    let init = function () {
        let sheetID = "1FqD-0CJeg-EyMn8NDWCyAY4LtodSnN2qGTS2Re3zEmg";
        let sheetURL = `https://spreadsheets.google.com/feeds/list/${sheetID}/1/public/values?alt=json`;
        let lastYear;

        $.getJSON(sheetURL, function (data) {
            // loop over all news and prepare news list
            let newsList = $('#code-savvy-news-list');
            Object.values(data.feed.entry).forEach(function (thisNews) {
                // a little help from: https://gist.github.com/claytongulick/bf05ecebe7a2bbb96b585b74af203eed
                // about if in string template literals
                let date = moment(thisNews.gsx$date.$t, 'MM-DD-YYYY')
                let thisDay = date.format('DD');
                let thisMonth = date.format('MMM');
                let thisYear = date.format('YYYY');
                let newsItemHTML = ``;

                if ( thisYear !== lastYear ) {
                    newsItemHTML = `<li class="year-header">${thisYear}</li>`;
                    lastYear = thisYear;
                }

                newsItemHTML += `
                    <li>
                        <div class="news-date">
                            <span class="news-date_day">${thisDay}</span><span class="news-date_month">${thisMonth}</span>
                        </div>
                        <div class="news-details">
                            <p class="news-org">${thisNews.gsx$newsorg.$t}</p>
                            ${
                                (gsx$newslink => {
                                    if (gsx$newslink.$t.length) {
                                        return `<a target="_blank" href="${thisNews.gsx$newslink.$t}">${thisNews.gsx$title.$t}</a>`
                                    } else {
                                        return `<p>${thisNews.gsx$title.$t}</p>`
                                    }
                                })(thisNews.gsx$newslink)
                            }
                        </div>
                    </li>`;
                    newsList.append(newsItemHTML);
            });
        });
    };
    return {
        init: init
    };
}(jQuery));