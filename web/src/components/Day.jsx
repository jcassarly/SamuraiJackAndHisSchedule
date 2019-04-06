import React, { Component } from 'react';
import PropTypes from 'prop-types';

import moment from 'moment-timezone';

import { Event } from '../events/Event';
import '../styles/Day.css';

/**
 * The component for displaying the schedule for a single day in the day view
 */
class Day extends Component {
    /**
     * day: the day to be displayed
     * events: a list of events to display, can be empty
     */
    static propTypes = {
        day: PropTypes.instanceOf(moment).isRequired,
        events: PropTypes.arrayOf(PropTypes.instanceOf(Event)).isRequired,
    }

    /**
     * Helper function to generate all the div elements corresponding to each hour
     * @param {day} the day to be displayed
     * Returns an array of div elements for each hour
     */
    static generateHours(day) {
        const hours = [];
        const current = day.clone().startOf('day');
        const end = day.clone().add(1, 'day').startOf('day');

        while (end.diff(current, 'hours') > 0) {
            // div for displaying the actual hour number
            hours.push((
                <div key={`l-${current.unix()}`} className="hour">
                    {current.hour()}
                </div>
            ));
            // div for displaying the hour blocks
            hours.push(<div key={current.unix()} className="evHour" />);

            current.add(1, 'hour');
        }
        return hours;
    }

    render() {
        // see propTypes
        const { day, events } = this.props;

        // start and end of the day
        const dayStart = day.clone().startOf('day');
        const dayEnd = day.clone().endOf('day');

        // filters out all events that aren't in that day
        const dayEv = new Event(null, null, dayStart, dayEnd);
        const currEvents = events.filter(event => Event.overlap(dayEv, event));

        return (
            <div className="calDay">
                <div className="dayEvents">
                    {currEvents.map((event) => { // add each event to the calendar
                        // start and end of the event, but cut off if the event spans
                        //     into the next or previous day
                        const virtualStart = moment.max(moment(event.startTime), dayStart);
                        const virtualEnd = moment.min(moment(event.endTime), dayEnd);

                        // convert to hours, then ems for positioning of the element
                        const startPos = virtualStart.diff(dayStart, 'minutes') / 60 * 3;
                        const length = virtualEnd.diff(virtualStart, 'minutes') / 60 * 3;

                        // returns a correctly positioned div representing an event
                        // The events get positioned overtop of calHours
                        return <div key={event.name} style={{ top: `${startPos}em`, height: `${length}em` }}>{event.name}</div>;
                    })}
                </div>
                <div className="calHours">
                    { Day.generateHours(day) }
                </div>
            </div>
        );
    }
}

export default Day;
