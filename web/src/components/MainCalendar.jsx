import React from 'react';
import PropTypes from 'prop-types';

import '../styles/MainCalendar.css';

/**
 * Main component for diplaying the calendar
 * Calendar can be a month, week, or day calendar depending on its state
 */
const MainCalendar = (props) => {
    const {
        type,
        types,
        pos,
        beginScrollClose,
        scrollClose,
        endScroll,
        children,
    } = props;
    let { calElem } = props;
    const beginScroll = beginScrollClose(e => e.touches[0].pageY);
    const scroll = scrollClose(e => e.touches[0].pageY);

    if (type === types.MONTH) {
        calElem = (
            <div className="calendarSlider">
                <div
                    className="slideContainer"
                    onTouchStart={beginScroll}
                    onTouchMove={scroll}
                    onTouchEnd={endScroll}
                    onTouchCancel={endScroll}
                >
                    <div className="calContainer" style={{ top: `${pos}px` }}>
                        {calElem}
                    </div>
                </div>
            </div>
        );
    }

    // Display the calendar with a CalHeader component at the top,
    //     followed by a Toolbar element,
    //     followed by the correct main calendar element
    return (
        <div className="calHome">
            {children}
            {calElem}
        </div>
    );
};

/**
 * edit: whether the edit button is selected in toolbar
 * events: An array of events passed in by redux: state.events.events
 * navNewEvent: A handler for navigating to the new event form, gets passed in by the
 *     App component
 * moveEvent: A handler for moving an event (used for drag-drop)
 * changeStart: A handler for changing the start of an event (used for resize)
 * changeEnd: A handler for changing the end of an event (used for resize)
 * cut: A handler for cutting an event
 * copy: A handler for copying an event
 * paste: A handler for pasting an event
 */
MainCalendar.propTypes = {
    type: PropTypes.number.isRequired,
    types: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    pos: PropTypes.number.isRequired,
    beginScrollClose: PropTypes.func.isRequired,
    scrollClose: PropTypes.func.isRequired,
    endScroll: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
    calElem: PropTypes.node.isRequired,
};

export default MainCalendar;
