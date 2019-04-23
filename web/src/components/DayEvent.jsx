import React from 'react';
import PropTypes from 'prop-types';

import { Event } from '../share/events/Event';
import ColorEnum from '../share/ColorEnum';

const DayEvent = (props) => {
    // see propTypes
    const {
        startHours,
        length,
        onMouseDown,
        onClip,
        event,
        navEditEvent,
    } = props;

    return (
        <button
            type="button"
            className="event"
            style={{
                top: `${startHours * 3}em`,
                height: `${length * 3}em`,
                backgroundColor: ColorEnum.backColor[event.color],
                color: ColorEnum.textColor[event.color],
            }}
            onMouseDown={onMouseDown}
            onTouchStart={onMouseDown}
            onClick={() => {
                onClip();
                navEditEvent(event.id);
            }}
        >
            {event.name}
        </button>
    );
};

/**
 * startHours: the start time of the event (normalized to the day)
 * length: the length of the event (again, normalized to the day)
 * onMouseDown: event handler for mouse down events
 * onClip: event handler for clipboard events
 * event: the event to display
 */
DayEvent.propTypes = {
    startHours: PropTypes.number.isRequired,
    length: PropTypes.number.isRequired,
    onMouseDown: PropTypes.func.isRequired,
    onClip: PropTypes.func.isRequired,
    event: PropTypes.instanceOf(Event).isRequired,
    navEditEvent: PropTypes.func.isRequired,
};

export default DayEvent;
