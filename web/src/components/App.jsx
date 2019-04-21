import React from 'react';
import PropTypes from 'prop-types';

import '../styles/App.css';

/**
 * Primary toplevel app component.
 * renders different toplevel components based on the nav state.
 */
const App = (props) => {
    const {
        children,
        onClick,
        onKeyPress,
    } = props;
    return (
        <div
            id="main"
            className="app"
            onClick={onClick}
            onKeyPress={onKeyPress}
            role="button"
            tabIndex={0}
        >
            {children}
        </div>
    );
};

App.propTypes = {
    children: PropTypes.node.isRequired,
    onClick: PropTypes.func.isRequired,
    onKeyPress: PropTypes.func.isRequired,
};

export default App;
