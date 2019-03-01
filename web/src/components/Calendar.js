import React from 'react';

import startOfMonth from 'date-fns/start_of_month';
import startOfWeek from 'date-fns/start_of_week';
import endOfWeek from 'date-fns/end_of_week';
import addWeeks from 'date-fns/add_weeks';
import eachDay from 'date-fns/each_day';

function createDayList(date, elem) {
    calDates = [];
    startDate = startOfWeek(startOfMonth(date));
    return eachDay(
        startDate,
        endOfWeek(addWeeks(startDate, 5)) // 6 weeks total, covering an entire calendar
    ).map(day => <elem key={day} date={day} /> );
}

Calendar = props => {
    return (
        <div>
            {createDayList(props.date, props.children[0])}
        </div>
    );
}
