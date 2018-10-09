/*jsLint es6, this */
/*global jQuery, window */

// the scroll to top function for long pages
let upcomingEvents = (function ($, undefined) {
    "use strict";

    let init = function () {
        let calID = "glinka.co_m032tqboc6l83vmi0a2h4uashk@group.calendar.google.com";
        let calKey = "AIzaSyBg6sxHiXOgauTfQ0MRvyAAu3ylyePHY_M";
        let calOptions = "&singleEvents=true&orderBy=starttime&maxResults=1";
        let calURL = `https://www.googleapis.com/calendar/v3/calendars/${calID}/events?key=${calKey}${calOptions}`;
        $.getJSON(calURL, function (data) {
            console.log(data);

            let date = moment(new Date(data.items[0].start.dateTime)).format("MMMM Do, YYYY");
            let startTime = moment(new Date(data.items[0].start.dateTime)).format("LT");
            let endTime = moment(new Date(data.items[0].end.dateTime)).format("LT");
            let locationQueryTerm = data.items[0].location.replace(/,/g, '%20');
            let mapLink = `https://www.google.com/maps/search/?api=1&query=${locationQueryTerm}`;
            
            let nextEvent = $("#next-event");
            nextEvent.find('.event-title').html(data.items[0].summary);
            nextEvent.find('.event-date').html(date);
            nextEvent.find('.start-time').html(startTime);
            nextEvent.find('.end-time').html(endTime);
            nextEvent.find('.event-description').html(data.items[0].description);
            nextEvent.find('.event-location').html(data.items[0].location);
            nextEvent.find('.event-map-link').attr('href', mapLink);



            $('#event1').html(data.items[0].summary)
        });
    };
    return {
        init: init
    };
}(jQuery));