import React from 'react';
import PropTypes from 'prop-types';

import '../styles/CalHeader.css';

/**
 * Component for the header of the calendar
 * Displays the date and navigation for changing the date and calendar type
 */
const CalHeader = (props) => {
    const { children } = props;
    return (
        <div className="calHeader">
            {children}
        </div>
    );
};

/**
 * children: the button children that the calheader contains
 */
CalHeader.propTypes = {
    children: PropTypes.node.isRequired,
};

export default CalHeader;
