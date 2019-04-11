import React from 'react';
import PropTypes from 'prop-types';
import ColorEnum from './ColorEnum';
import { Event } from '../events/Event';

import '../../styles/MonthCell.css';

/**
 * pure display component
 * displays a cell corresponding to a specific date in the month view
 */
const MonthCell = (props) => {
    // see propTypes
    const { current, date, events } = props;

    // If the cell does not correspond to the current month, it greys out the date number
    // Displays every event that day in a list inside the cell, overflow is cut off
    return (
        <div className={`monthCell ${(current ? 'current' : '')}`}>
            <div className="monthDay">{date}</div>
            {events.map(event => (
                <div key={event.name} style={{ backgroundColor: ColorEnum.backColor[event.color], color: ColorEnum.textColor[event.color] }} className="monthEvent">{event.name}</div>
            ))}
        </div>
    );
};

/**
 * current: whether the date corresponds to the currently viewed month
 * date: the number of the date to be displayed by the cell
 * events: a list of events that happend on that date
 */
MonthCell.propTypes = {
    current: PropTypes.bool,
    date: PropTypes.number.isRequired,
    events: PropTypes.arrayOf(PropTypes.instanceOf(Event)),
};

// prop defualts
MonthCell.defaultProps = {
    current: false,
    events: [],
};

export default MonthCell;
