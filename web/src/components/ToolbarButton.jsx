import React from 'react';
import PropTypes from 'prop-types';

/**
 * Component for the header of the calendar
 * Displays the date and navigation for changing the date and calendar type
 */
const ToolbarButton = (props) => {
    const {
        click,
        children,
        selected,
    } = props;
    return (
        <button type="button" onClick={click} className={selected ? 'selected' : ''}>
            {children}
        </button>
    );
};

/**
 * click: click handler
 * children: what to display in the button, usually text
 * whether it is currently selected
 */
ToolbarButton.propTypes = {
    click: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
    selected: PropTypes.bool,
};

ToolbarButton.defaultProps = {
    selected: false,
};

/**
 * Component for the header of the calendar
 * Displays the date and navigation for changing the date and calendar type
 */
const ToolbarSideMenu = (props) => {
    const {
        onClick,
        children,
    } = props;
    return (
        <button type="button" onClick={onClick} className="sideMenuButton">
            {children}
        </button>
    );
};

/**
 * click: click handler
 * children: what to display in the button, usually text
 * whether it is currently selected
 */
ToolbarSideMenu.propTypes = {
    onClick: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
};

export default ToolbarButton;
export { ToolbarSideMenu };
