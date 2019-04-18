import React from 'react';
import PropTypes from 'prop-types';

import '../styles/Toolbar.css';

/**
 * Class to represent the Toolbar on the homscreen
 */
const Toolbar = (props) => {
    const { children } = props;
    return (
        <div className="toolbar">
            {children}
        </div>
    );
};

/**
 * navNewEvent: navigates to the form for creating a new event
 * toggleMode: toggles the mode of the calendar (eg. drag/drop mode, resize, etc.)
 * currMode: the current mode that the calednar is in
 * calType: the type of calendar being displayed
 * syncFromAsync: pulls the events from the server to the redux store
 * events: the list of events from the redux store
 * deadlines: the list of deadlines from the redux store
 * settings: the settings object from the redux store
 * navSettings: navigates to the form for managing settings
 */
Toolbar.propTypes = {
    children: PropTypes.node.isRequired,
};

export default Toolbar;
