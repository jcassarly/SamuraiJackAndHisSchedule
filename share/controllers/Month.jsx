import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import moment from 'moment-timezone';

import { Event } from '../events/Event';
import MonthCell from './MonthCell';
import '../../styles/Month.css';

/**
 * Helper function to generate monthCells depending on the month
 * each month is displayed with 6 weeks regardless of the length
 * dates not corresponding to the current month are grayed out
 * displays the 6 weeks before and after the current month for navigation purposes
 */
function createDayList(date, events) {
    // Finds the start of the month, then finds 6 weeks prior, then gets the start of that week
    const currDate = date.clone().startOf('month').subtract(6, 'weeks').startOf('week');

    // array for holding the month cell elements
    const dates = [];
    for (let i = 0; i < 3 * 6 * 7; i += 1) {
        // filters our events not ocurring on the current date
        const day = new Event(null, null, currDate, currDate.clone().endOf('day'));
        const currEvents = events.filter(event => Event.overlap(day, event));

        // adds a MonthCell component corresponding to the current date with relevent events
        // current is set to true if the date corresponds to the current month
        dates.push(<MonthCell
            key={currDate.toDate()}
            date={currDate.date()}
            current={currDate.month() === date.month()}
            events={currEvents}
        />);
        currDate.add(1, 'day');
    }
    return dates;
}

class Month extends Component {
    /**
     * increases performance, if the month prop does not change to a different month, don't rerender
     * used by react
     */
    shouldComponentUpdate(nextProps) {
        const { month, events } = this.props;
        return nextProps.month.diff(month, 'months') !== 0 || !_.isEqual(events, nextProps.events);
    }

    render() {
        // see proptypes
        const { month, events } = this.props;
        // uses createDayList to add the MonthCell grid to the calendar
        return (
            <div className="calMonth">
                {createDayList(month, events)}
            </div>
        );
    }
}

/**
 * month: the current month being displayed
 * events: an array of events to display
 */
Month.propTypes = {
    month: PropTypes.instanceOf(moment).isRequired,
    events: PropTypes.arrayOf(PropTypes.instanceOf(Event)).isRequired,
};

export default Month;
