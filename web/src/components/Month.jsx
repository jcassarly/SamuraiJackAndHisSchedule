import React from 'react';
import PropTypes from 'prop-types';

import '../styles/Month.css';

const Month = (props) => {
    // see proptypes
    const { children } = props;
    return (
        <div className="calMonth">
            {children}
        </div>
    );
};

/**
 * month: the current month being displayed
 * events: an array of events to display
 */
Month.propTypes = {
    children: PropTypes.node.isRequired,
};

export default Month;
