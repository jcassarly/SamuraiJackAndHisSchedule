import React from 'react';
import PropTypes from 'prop-types';

import '../styles/Toolbar.css';

/**
 * toolbar component for manipulating the calendar
 */
const Toolbar = (props) => {
    // see propTypes
    const { navNewEvent } = props;
    // contains buttons corresponding to possible actions the user can take using the toolbar
    return (
        <div className="toolbar">
            <button type="button" onClick={navNewEvent}>New Event</button>
        </div>
    );
};

/**
 * navNewEvent: navigates to the form for creating a new event
 */
Toolbar.propTypes = {
    navNewEvent: PropTypes.func.isRequired,
};

export default Toolbar;
