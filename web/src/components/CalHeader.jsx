import React from 'react';
import PropTypes from 'prop-types';

import '../styles/CalHeader.css';

/**
 * Component for the header of the calendar
 * Displays the date and navigation for changing the date and calendar type
 */
const CalHeader = (props) => {
    const {
        onLeft,
        onRight,
        onSwitch,
        date,
    } = props;
    return (
        <div className="calHeader">
            <button type="button" className="nav" onClick={onLeft}>&lt;</button>
            <button type="button" onClick={onSwitch}>{date}</button>
            <button type="button" className="nav" onClick={onRight}>&gt;</button>
        </div>
    );
};

/**
 * onLeft: handler for when the user navigates left
 * onRight: handler for when the user navigates right
 * onSwitch: handler for when the user navigates to the next type of calendar
 * date: the date to display preformatted
 */
CalHeader.propTypes = {
    onLeft: PropTypes.func.isRequired,
    onRight: PropTypes.func.isRequired,
    onSwitch: PropTypes.func.isRequired,
    date: PropTypes.node.isRequired,
};

export default CalHeader;
