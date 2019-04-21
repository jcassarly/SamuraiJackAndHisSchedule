import React from 'react';
import PropTypes from 'prop-types';

import '../styles/App.css';

/**
 * Primary toplevel app component.
 * renders different toplevel components based on the nav state.
 */
const App = (props) => {
    const { children } = props;
    return (
        <div className="app">
            {children}
        </div>
    );
};

App.propTypes = {
    children: PropTypes.node.isRequired,
};

export default App;
