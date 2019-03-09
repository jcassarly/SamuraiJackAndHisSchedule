import React, { Component } from 'react';
import PropTypes from 'prop-types';

import moment from 'moment';

import MonthCell from './MonthCell';
import '../styles/Month.css';

function createDayList(date) {
    const currDate = date.clone().startOf('month').subtract(6, 'weeks').startOf('week');
    const dates = [];
    for (let i = 0; i < 3 * 6 * 7; i += 1) {
        dates.push(<MonthCell
            key={currDate.toDate()}
            date={currDate.clone()}
            current={currDate.month() === date.month()}
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
        const { month } = this.props;
        return (
            <div className="calendar">
                {createDayList(month)}
            </div>
        );
    }
}

Month.propTypes = {
    month: PropTypes.instanceOf(moment).isRequired,
};

export default Month;
