import React from 'react';
import PropTypes from 'prop-types';

const DayEvents = (props) => {
    const { children } = props;
    return (
        <div className="dayEvents">
            {children}
        </div>
    );
};

/**
 * children: all the events to display
 */
DayEvents.propTypes = {
    children: PropTypes.node.isRequired,
};

export default DayEvents;
