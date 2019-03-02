import React from 'react';

import '../styles/Calendar.css'

import startOfMonth from 'date-fns/start_of_month';
import startOfWeek from 'date-fns/start_of_week';
import endOfWeek from 'date-fns/end_of_week';
import addWeeks from 'date-fns/add_weeks';
import eachDay from 'date-fns/each_day';

function createDayList(date, Elem) {
    let startDate = startOfWeek(startOfMonth(date));
    let dayList = eachDay(
        startDate,
        endOfWeek(addWeeks(startDate, 5)) // 6 weeks total, covering an entire calendar
    ).map(day => {
        return (
            <Elem
                key={day}
                date={day}
                current={day.getMonth()===date.getMonth()}
            />
        )
    });
    return dayList
}

const Calendar = props => {
    return (
        <div className="calendar">
            {createDayList(props.month, props.cell)}
        </div>
    );
}

export default Calendar
