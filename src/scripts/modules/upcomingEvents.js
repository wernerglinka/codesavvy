/*jsLint es6, this: true */
/*global jQuery, window, moment */

// the scroll to top function for long pages
let upcomingEvents = (function ($, undefined) {
    "use strict";

    let buildEventObj = event => {
        let date = moment(new Date(event.start.dateTime)).format("MMMM Do, YYYY");
        let temp = [];
        temp.date = moment(new Date(event.start.dateTime)).format("MMMM Do, YYYY");
        temp.title = event.summary;
        temp.startTime = moment(new Date(event.start.dateTime)).format("LT");
        temp.endTime = moment(new Date(event.end.dateTime)).format("LT");
        temp.location = event.location;
        let locationQueryTerm = event.location.replace(/,/g, '%20');
        temp.mapLink = `https://www.google.com/maps/search/?api=1&query=${locationQueryTerm}`;
        return temp;
    }

    let init = function () {
        // get the 4 next events and see if we have multiple for the next event day
        // prepare a info pane that is shown when user clicks the event title
        // this way, when we have multiple events on the next events day, we can show them all
        /*
        let calID = [
            "codesavvy.org_qb9mb086pvdeaj3a0vrsgtq3uo@group.calendar.google.com", // CoderDojo TC
            "codesavvy.org_6hbsd3g9j98tjclh328e5bji5c@group.calendar.google.com", // get with the program
            "codesavvy.org_kocktpkfeoq5ets7ueq6ahtq7g@group.calendar.google.com", // northfield coderdojo
            "codesavvy.org_kq66e6mmrcgf470apc4i4sgrtc@group.calendar.google.com", // rebecca coderdojo
            "codesavvy.org_vtbr9o2dmjm152b0e9peaotl1s@group.calendar.google.com", // technovation[mn]
            "kidscode@codesavvy.org" // kids code
        ];
        */
        let calID = "kidscode@codesavvy.org" // kids code
        let calKey = "AIzaSyAtfBMbq9zyxuelJG94mkvgUoBA58CF6P4";
        let calOptions = "&singleEvents=true&orderBy=starttime&maxResults=4";
        let calURL = `https://www.googleapis.com/calendar/v3/calendars/${calID}/events?key=${calKey}${calOptions}`;
        let nextEvents = [];
        let date, nextEvent, eventDetails;

        // get five calendar events, consolidate into one array and then find the next one(s)


        $.getJSON(calURL, function (data) {
            // get the date for the first event
            let nextDay = moment(new Date(data.items[0].start.dateTime)).format("MMMM Do, YYYY");
            // loop over the events and check if we have more events for the first event day
            Object.values(data.items).forEach(function (thisEvent) {
                date = moment(new Date(thisEvent.start.dateTime)).format("MMMM Do, YYYY");
                if (nextDay === date) {
                    nextEvents.push(buildEventObj(thisEvent));
                }
            });

            // now array nextEvents hold all event objects for the next events day
            // typically that is only 1 event

            let events = $("#upcoming-events");
            nextEvent = $("#next-event");
            let eventsDate = $('#events-date');
            let today = moment(new Date()).format("MMMM Do, YYYY");
            let tomorrow = moment(new Date()).add(1, 'days').format("MMMM Do, YYYY");

            switch (nextEvents[0].date) {
            case today:
                eventsDate.html("Today");
                break;
            case tomorrow:
                eventsDate.html("Tomorrow");
                break;
            default:
                eventsDate.html("On " + nextEvents[0].date);
            }

            nextEvents.forEach(function (thisEvent) {
                // add title link to Next Event section
                nextEvent.append(`<li><a class="event-title learn-more-link">${thisEvent.title}</a></li>`);

                // add the events details pane
                eventDetails = `
                    <div class="slidein">
                        <i class="icon icon-x"></i>
                        <h2>${thisEvent.title}</h2>
                        <p><strong>Date:</strong> ${thisEvent.date}</p>
                        <p><strong>Time:</strong> ${thisEvent.startTime} to ${thisEvent.endTime}</p>
                        <hr>
                        <h3>Venue</h3> 
                        <p>${thisEvent.location}</p>
                        <a target="_blank" href="${thisEvent.mapLink}">+ Google Map</a>
                    </div>`;
                    events.find('.has-slidein').append(eventDetails);
            });

            // add event handler to events title to show event details when clicked
            let eventTitles = events.find('.event-title').on('touchclick', function () {
                let thisEventTrigger = $(this);
                let thisEventIndex = thisEventTrigger.index(eventTitles);

                thisEventTrigger.toggleClass('is-open');

                if (thisEventTrigger.hasClass('is-open')) {
                    events.find('.slidein').not(thisEventIndex).css('left', '110%');
                    thisEventTrigger.parent().siblings().find('.is-open').removeClass('is-open');
                    events.find('.slidein').eq(thisEventIndex).css('left', 0);
                } else {
                    events.find('.slidein').eq(thisEventIndex).css('left', '110%');
                }
            });

            events.find('.icon-x').on('touchclick', function () {
                events.find('.slidein').css('left', '110%');
                eventTitles.removeClass('is-open');
            });
        });
    };
    return {
        init: init
    };
}(jQuery));

/*
<li><h1 class="event-title"></h1></li>
<li><strong>Date:</strong> <span class='event-date'></span></li>
<li class='event-time'><strong>Time:</strong> <span class='start-time'></span> to <span class='end-time'></span></li>
<li class='event-description'></li>
<li><strong>Venue</strong><p class='event-location'></p></li>
<li class='event-map'><a target='_blank' class='event-map-link' href=''>+ Google Map</a></li>

*/