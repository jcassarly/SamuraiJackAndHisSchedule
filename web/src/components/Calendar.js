import React from 'react';
import PropTypes from 'prop-types';

import startOfMonth from 'date-fns/start_of_month';
import startOfWeek from 'date-fns/start_of_week';
import endOfWeek from 'date-fns/end_of_week';
import addWeeks from 'date-fns/add_weeks';
import eachDay from 'date-fns/each_day';

import '../styles/Calendar.css';

function createDayList(date, Elem) {
    const startDate = startOfWeek(startOfMonth(date));
    const dayList = eachDay(
        startDate,
        endOfWeek(addWeeks(startDate, 5)), // 6 weeks total, covering an entire calendar
    ).map(day => (
        <Elem
            key={day}
            date={day}
            current={day.getMonth() === date.getMonth()}
        />
    ));
    return dayList;
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
    month: PropTypes.instanceOf(Date).isRequired,
    cell: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.instanceOf(React.Component),
    ]).isRequired,
};

export default Calendar;
