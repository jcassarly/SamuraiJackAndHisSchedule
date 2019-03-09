import React from 'react';
import propTypes from 'prop-types';

import MonthCell from './MonthCell';
import Calendar from './Calendar';

const MainCalendar = (props) => {
    const { month } = props;
    return (
        <div>
            <Calendar month={month} cell={MonthCell} />
        </div>
    );
};

MainCalendar.propTypes = {
    month: propTypes.instanceOf(Date).isRequired,
};

export default MainCalendar;
