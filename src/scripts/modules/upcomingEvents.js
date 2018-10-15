/*jsLint es6, this: true */
/*global jQuery, window, moment */

// the scroll to top function for long pages
let upcomingEvents = (function ($, undefined) {
    "use strict";

    let buildEventObj = event => {
        let temp = [];
        temp.date = new Date(event.start.dateTime); // date becomes a dateTime object so we can compare them later
        temp.title = event.summary;
        temp.startTime = moment(new Date(event.start.dateTime)).format("LT");
        temp.endTime = moment(new Date(event.end.dateTime)).format("LT");
        temp.location = event.location;
        let locationQueryTerm = event.location.replace(/,/g, '%20');
        temp.mapLink = `https://www.google.com/maps/search/?api=1&query=${locationQueryTerm}`;
        return temp;
    }

    let init = function () {
        // get the next events - up to 4 - and see if we have multiple for the next event day
        // prepare a info pane that is shown when user clicks the event title
        // this way, when we have multiple events on the next events day, we can show them all

        // calendar IDs for all Code Savvy calendars
        let calendarIDs = [
            "codesavvy.org_qb9mb086pvdeaj3a0vrsgtq3uo@group.calendar.google.com", // CoderDojo TC
            "codesavvy.org_6hbsd3g9j98tjclh328e5bji5c@group.calendar.google.com", // get with the program
            "codesavvy.org_kocktpkfeoq5ets7ueq6ahtq7g@group.calendar.google.com", // northfield coderdojo
            "codesavvy.org_kq66e6mmrcgf470apc4i4sgrtc@group.calendar.google.com", // rebecca coderdojo
            "codesavvy.org_vtbr9o2dmjm152b0e9peaotl1s@group.calendar.google.com", // technovation[mn]
            "kidscode@codesavvy.org" // kids code
        ];

        let eventsStartDate = new Date().toISOString(); // we request on event from today forward
        let calURLBase = `https://www.googleapis.com/calendar/v3/calendars/`;
        let calKey = "AIzaSyAtfBMbq9zyxuelJG94mkvgUoBA58CF6P4";
        let calOptions = `&singleEvents=true&orderBy=starttime&maxResults=4&timeMin=${eventsStartDate}`;
        let nextEvents = [];
        let date, eventDetails;

        // get all calendar events, consolidate into one array and then find the next one(s)

        // build the request array for all calendars
        // reference: http://michaelsoriano.com/working-with-jquerys-ajax-promises-and-deferred-objects/
        let calendarRequests = [];
        calendarIDs.forEach(thisCalendarID => {
            calendarRequests.push($.get(`${calURLBase}${thisCalendarID}/events?key=${calKey}${calOptions}`));
        });
        // execute all calendar requests
        $.when.apply($,calendarRequests).done(function(){
            //arguments is an array of responses [0][data, status, xhrObj],[1][data, status, xhrObj]...
            let allEvents = [];
            nextEvents = [];

            Object.values(arguments).forEach(thisResponse => {
                if (thisResponse[0].items.length) { // skip calendars with no future events in them
                    thisResponse[0].items.forEach( thisEvent => {
                        allEvents.push(buildEventObj(thisEvent)); // build the compount array with all events
                    });
                }
            });

            // sort all events by date, next date is first
            allEvents = allEvents.sort(function(a,b){
                return a.date - b.date;
            });

            // get the date for the first event
            let nextDay = moment(new Date(allEvents[0].date)).format("MMMM Do, YYYY");
            // loop over the events and check if we have more events for the first event day
            Object.values(allEvents).forEach(function (thisEvent) {
                date = moment(new Date(thisEvent.date)).format("MMMM Do, YYYY");
                if (nextDay === date) {
                    nextEvents.push(thisEvent);
                }
            });

            // now array nextEvents holds all event objects for the next events day
            // typically that is only 1 event but can be more on occassion
            let events = $("#upcoming-events");
            let nextEvent = $("#next-event");
            let eventsDate = $('#events-date');
            // apply a nice date format
            let today = moment(new Date()).format("MMMM Do, YYYY");
            let tomorrow = moment(new Date()).add(1, 'days').format("MMMM Do, YYYY");
            let thisDate = moment(new Date(nextEvents[0].date)).format("MMMM Do, YYYY");

            // if the event is today or tomorrow we use that instead of a date
            switch (thisDate) {
            case today:
                eventsDate.html("Today");
                break;
            case tomorrow:
                eventsDate.html("Tomorrow");
                break;
            default:
                eventsDate.html("On " + thisDate);
            }

            // render the upcoming event(s)
            nextEvents.forEach(function (thisEvent) {
                // add title link to Next Event section
                nextEvent.append(`<li><a class="event-title learn-more-link">${thisEvent.title}</a></li>`);

                // add the events details pane
                eventDetails = `
                    <div class="slidein">
                        <i class="icon icon-x"></i>
                        <h2>${thisEvent.title}</h2>
                        <p><strong>Date:</strong> ${thisDate}</p>
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