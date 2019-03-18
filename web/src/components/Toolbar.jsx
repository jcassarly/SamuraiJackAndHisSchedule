import React from 'react';
import PropTypes from 'prop-types';

import '../styles/Toolbar.css';

const Toolbar = (props) => {
    const { navNewEvent } = props;
    return (
        <div className="toolbar">
            <button type="button" onClick={navNewEvent}>New Event</button>
        </div>
    );
};

Toolbar.propTypes = {
    navNewEvent: PropTypes.func.isRequired,
};

export default Toolbar;
