import React from 'react';
import PropTypes from 'prop-types';

import moment from 'moment';

import '../styles/Calendar.css';

function createDayList(date, Elem) {
    const currDate = date.clone().startOf('month').startOf('week');
    const dates = [];
    for (let i = 0; i < 6 * 7; i += 1) {
        dates.push(<Elem
            key={currDate.toDate()}
            date={currDate.clone()}
            current={currDate.month() === date.month()}
        />);
        currDate.add(1, 'day');
    }
    return dates;
}

const Calendar = (props) => {
    const { month, cell } = props;
    return (
        <div className="calendar">
            {createDayList(month, cell)}
        </div>
    );
};

Calendar.propTypes = {
    month: PropTypes.instanceOf(moment).isRequired,
    cell: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.instanceOf(React.Component),
    ]).isRequired,
};

export default Calendar;
