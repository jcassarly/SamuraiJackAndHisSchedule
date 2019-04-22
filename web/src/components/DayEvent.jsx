/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
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
    } = props;

    return (
        <div
            style={{
                top: `${startHours * 3}em`,
                height: `${length * 3}em`,
                backgroundColor: ColorEnum.backColor[event.color],
                color: ColorEnum.textColor[event.color],
            }}
            onMouseDown={onMouseDown}
            onTouchStart={onMouseDown}
            onClick={onClip}
        >
            {event.name}
        </div>
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
};

export default DayEvent;
