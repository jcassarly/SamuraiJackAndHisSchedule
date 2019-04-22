import React from 'react';
import PropTypes from 'prop-types';

import '../styles/Week.css';

/**
 * Component for displaying the calendar in Week view
 */
const Week = (props) => {
    const { children } = props;
    return <div className="calWeek">{children}</div>;
};

Week.propTypes = {
    children: PropTypes.node.isRequired,
};

export default Week;
