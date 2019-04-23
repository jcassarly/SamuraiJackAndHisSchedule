import React from 'react';
import PropTypes from 'prop-types';

/**
 * Component for the header of the calendar
 * Displays the date and navigation for changing the date and calendar type
 */
const SideMenuButton = (props) => {
    const {
        onClick,
        children,
    } = props;
    return (
        <button type="button" onClick={onClick} className="sidemenubutton">
            {children}
        </button>
    );
};

/**
 * click: click handler
 * children: what to display in the button, usually text
 * whether it is currently selected
 */
SideMenuButton.propTypes = {
    onClick: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
};

export default SideMenuButton;
