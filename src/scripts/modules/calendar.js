/*jsLint es6, this */
/*global jQuery, window, moment */

// function to manage top nav visibility
let calendar = (function ($) {
    'use strict';

    let init = function () {
        // create the popup html
        let eventPopUpHTML =
                `<div id='event-details' class='event-popup'>
                    <i class='icon icon-x'></i>
                    <ul class='list-unstyled event-data'>
                        <li class='event-title'></li>
                        <li><strong>Date:</strong> <span class='event-date'></span></li>
                        <li class='event-time'><strong>Time:</strong> <span class='start-time'></span> to <span class='end-time'></span></li>
                        <li class='event-description'></li>
                        <li><strong>Venue</strong><p class='event-location'></p></li>
                        <li class='event-map'><a target='_blank' class='event-map-link' href=''>+ Google Map</a></li>
                    </ul>
                </div>`;

        // append the popup container to body  
        $('body').append($(eventPopUpHTML));

        let eventPopup = $('#event-details');

        // render calendar
        let thisCal = $('#calendar');
        thisCal.fullCalendar({
            googleCalendarApiKey: "AIzaSyAtfBMbq9zyxuelJG94mkvgUoBA58CF6P4",
            eventSources: [
                {   googleCalendarId: "kidscode@codesavvy.org",
                    className: 'kids-code-event'
                },
                {   // get with the program calendar
                    googleCalendarId: "codesavvy.org_6hbsd3g9j98tjclh328e5bji5c@group.calendar.google.com",
                    className: 'get-with-the-program-event'
                },
                {   // northfield coderdojo calendar
                    googleCalendarId: "codesavvy.org_kocktpkfeoq5ets7ueq6ahtq7g@group.calendar.google.com",
                    className: 'northfield-coderdojo-event'
                },
                {   // rebecca coderdojo calendar
                    googleCalendarId: "codesavvy.org_kq66e6mmrcgf470apc4i4sgrtc@group.calendar.google.com",
                    className: 'rebecca-coderdojo-event'
                },
                {   // twin cities coderdojo calendar
                    googleCalendarId: "codesavvy.org_qb9mb086pvdeaj3a0vrsgtq3uo@group.calendar.google.com",
                    className: 'tc-coderddojo-event'
                },
                {   // technovation[mn] calendar
                    googleCalendarId: "codesavvy.org_vtbr9o2dmjm152b0e9peaotl1s@group.calendar.google.com",
                    className: 'technovation-mn-event'
                },
                {   // google holidays calendar
                    googleCalendarId: "en.usa#holiday@group.v.calendar.google.com",
                    className: 'calendar-holidays'
                }
            ],
            eventClick: function (calEvent, jsEvent, view) {
                jsEvent.preventDefault();

                // ignore holidays
                if ($(this).hasClass('calendar-holidays')) { return }

                let date = moment(new Date(calEvent.start)).format("MMMM Do, YYYY");
                let startTime = moment(new Date(calEvent.start)).format("LT");
                let endTime = moment(new Date(calEvent.end)).format("LT");
                let locationQueryTerm = calEvent.location.replace(/,/g, '%20');
                let mapLink = `https://www.google.com/maps/search/?api=1&query=${locationQueryTerm}`;

                eventPopup.find('.event-title').html(calEvent.title);
                eventPopup.find('.event-date').html(date);
                eventPopup.find('.start-time').html(startTime);
                eventPopup.find('.end-time').html(endTime);
                eventPopup.find('.event-description').html(calEvent.description);
                eventPopup.find('.event-location').html(calEvent.location);
                eventPopup.find('.event-map-link').attr('href', mapLink);

                // show the modal box
                eventPopup.addClass('event-details_active');
            }
        });
        let viewStatus = "grid";
        if ($(window).width() < 768) {
            thisCal.fullCalendar('changeView', 'listMonth');
            viewStatus = "list";
        }

        $(window).on('resize', function () {
            if ($(window).width() < 768 && viewStatus === "grid") {
                thisCal.fullCalendar('changeView', 'listMonth');
                viewStatus = "list";
            }
            if ($(window).width() >= 768 && viewStatus === "list") {
                thisCal.fullCalendar('changeView', 'month');
                viewStatus = "grid";
            }
        });

        // close the event popup
        eventPopup.find('.icon-x').on('touchclick', function () {
            $(this).parent().removeClass('event-details_active');
        });
    };
    return {
        init: init
    };
}(jQuery));