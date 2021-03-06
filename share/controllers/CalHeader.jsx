import React from 'react';
import PropTypes from 'prop-types';

import moment from 'moment-timezone';

import { types } from './MainCalendar';
import '../../styles/CalHeader.css';
import CalHeader from '../../components/CalHeader';

/**
 * Component for the header of the calendar
 * Displays the date and navigation for changing the date and calendar type
 */
const CalHeaderController = (props) => {
    // see CalHeader.propTypes
    const {
        onLeft,
        onRight,
        onSwitch,
        type,
    } = props;
    let { date } = props;

    // selects the format to display the date in based on the type of date
    let format = '';
    switch (type) {
    case types.DAY:
        format = 'MMM Do (ddd)';
        break;
    case types.WEEK:
        format = '[Week of] MMM Do';
        date = date.clone().startOf('week');
        break;
    case types.MONTH:
    default:
        format = 'MMMM (YYYY)';
    }

    return (
        <CalHeader
            onLeft={onLeft}
            onRight={onRight}
            onSwitch={onSwitch}
            date={date.format(format)}
        />
    );
};

/**
 * onLeft: a handler to navigate to the previous date (month, week, day)
 * onRight: a handler to navigate to the next date (month, week, day)
 * onSwitch: a handler to navigate to a different calendar view
 *     (cycles between month, week, and day)
 * date: the date being displayed
 * type: the type of date being displayed (month, week, or day)
 */
CalHeaderController.propTypes = {
    onLeft: PropTypes.func.isRequired,
    onRight: PropTypes.func.isRequired,
    onSwitch: PropTypes.func.isRequired,
    date: PropTypes.instanceOf(moment).isRequired,
    type: PropTypes.number.isRequired,
};

export default CalHeaderController;
