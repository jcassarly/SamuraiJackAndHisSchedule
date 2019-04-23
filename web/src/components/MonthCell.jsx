import React from 'react';
import PropTypes from 'prop-types';
import ColorEnum from '../share/ColorEnum';
import { Event } from '../share/events/Event';

import '../styles/MonthCell.css';

/**
 * pure display component
 * displays a cell corresponding to a specific date in the month view
 */
const MonthCell = (props) => {
    // see propTypes
    const {
        current,
        date,
        events,
        navEditEvent,
        editing,
    } = props;

    // If the cell does not correspond to the current month, it greys out the date number
    // Displays every event that day in a list inside the cell, overflow is cut off
    return (
        <div className={`monthCell ${(current ? 'current' : '')}`}>
            <div className="monthDay">{date}</div>
            {events.map(event => (
                <button
                    type="button"
                    key={event.name}
                    onClick={() => { navEditEvent(event.id); }}
                    style={{
                        backgroundColor: ColorEnum.backColor[event.color],
                        color: ColorEnum.textColor[event.color],
                    }}
                    className={`monthEvent ${editing ? 'editing' : ''}`}
                >
                    {event.name}
                </button>
            ))}
        </div>
    );
};

/**
 * current: whether the date corresponds to the currently viewed month
 * date: the number of the date to be displayed by the cell
 * events: a list of events that happend on that date
 * editing: whether the user is currently trying to edit an event
 */
MonthCell.propTypes = {
    current: PropTypes.bool,
    date: PropTypes.number.isRequired,
    events: PropTypes.arrayOf(PropTypes.instanceOf(Event)),
    navEditEvent: PropTypes.func.isRequired,
    editing: PropTypes.bool.isRequired,
};

// prop defualts
MonthCell.defaultProps = {
    current: false,
    events: [],
};

export default MonthCell;
