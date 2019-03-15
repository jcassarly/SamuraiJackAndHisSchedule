import React, { Component } from 'react';
import PropTypes from 'prop-types';

import moment from 'moment-timezone';

import { Event } from '../events/Event';
import MonthCell from './MonthCell';
import '../styles/Month.css';

function createDayList(date, events) {
    const currDate = date.clone().startOf('month').subtract(6, 'weeks').startOf('week');
    const dates = [];
    for (let i = 0; i < 3 * 6 * 7; i += 1) {
        const currEvents = events.filter(event => (
            moment(event.startTime).isBetween(currDate, currDate.clone().endOf('day'))
            || moment(event.endTime).isBetween(currDate, currDate.clone().endOf('day'))
        ));
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
    shouldComponentUpdate(nextProps) {
        const { month } = this.props;
        return nextProps.month.diff(month, 'months') !== 0;
    }

    render() {
        const { month, events } = this.props;
        return (
            <div className="calMonth">
                {createDayList(month, events)}
            </div>
        );
    }
}

Month.propTypes = {
    month: PropTypes.instanceOf(moment).isRequired,
    events: PropTypes.arrayOf(PropTypes.instanceOf(Event)).isRequired,
};

export default Month;
