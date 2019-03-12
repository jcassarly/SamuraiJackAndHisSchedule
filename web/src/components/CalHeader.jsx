import React from 'react';
import PropTypes from 'prop-types';

import moment from 'moment-timezone';

import '../styles/CalHeader.css';

const CalHeader = (props) => {
    const {
        onLeft,
        onRight,
        onSwitch,
        date,
        type,
    } = props;

    let format = '';
    switch (type) {
    case 'day':
        format = 'MMM Do (ddd)';
        break;
    case 'month':
    default:
        format = 'MMMM';
    }
    return (
        <div className="calHeader">
            <button type="button" className="nav" onClick={onLeft}>&lt;</button>
            <button type="button" onClick={onSwitch}>{date.format(format)}</button>
            <button type="button" className="nav" onClick={onRight}>&gt;</button>
        </div>
    );
};

CalHeader.propTypes = {
    onLeft: PropTypes.func.isRequired,
    onRight: PropTypes.func.isRequired,
    onSwitch: PropTypes.func.isRequired,
    date: PropTypes.instanceOf(moment).isRequired,
    type: PropTypes.oneOf([
        'month',
        'week',
        'day',
    ]).isRequired,
};

export default CalHeader;
