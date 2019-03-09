import React from 'react';
import propTypes from 'prop-types';

import moment from 'moment';

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
    month: propTypes.instanceOf(moment).isRequired,
};

export default MainCalendar;
