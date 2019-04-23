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
 * children: the child nodes
 */
Toolbar.propTypes = {
    children: PropTypes.node.isRequired,
};

export default Toolbar;
