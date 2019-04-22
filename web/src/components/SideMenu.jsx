import React from 'react';
import PropTypes from 'prop-types';

import '../styles/SideMenu.css';

/**
 * Class to represent the Toolbar on the homscreen
 */
const SideMenu = (props) => {
    const { children, style } = props;
    return (
        <div id="hm" style={style} className="sidemenu">
            {children}
        </div>
    );
};

/**
 * children: the child nodes
 */
SideMenu.propTypes = {
    children: PropTypes.node.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    style: PropTypes.any.isRequired,
};

export default SideMenu;
