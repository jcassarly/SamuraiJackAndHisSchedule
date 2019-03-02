import React from 'react';

import MonthCell from './MonthCell'
import Calendar from './Calendar'

const MainCalendar = props => {
    return (
        <div>
            <Calendar month={props.month} cell={MonthCell} />
        </div>
    );
}

export default MainCalendar
