/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import PropTypes from 'prop-types';

import '../styles/CalHeader.css';

/**
 * component to render the drag handlers for when a user is dragging an event
 */
const DragEv = (props) => {
    const {
        pos,
        onMouseDown,
    } = props;

    return (
        <div
            className="resize"
            style={{ top: `${pos * 3 - 0.5}em` }}
            onMouseDown={onMouseDown}
            onTouchStart={onMouseDown}
        />
    );
};

/**
 * pos: the position in hours to put the component
 * onMouseDown: a handler for when the user starts dragging this component
 */
DragEv.propTypes = {
    pos: PropTypes.number.isRequired,
    onMouseDown: PropTypes.func.isRequired,
};

export default DragEv;
