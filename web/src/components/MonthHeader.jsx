import React from 'react';
import propTypes from 'prop-types';

import moment from 'moment';

import '../styles/MonthHeader.css';

const MonthCell = (props) => {
    const { onLeft, onRight, month } = props;
    return (
        <div className="monthHeader">
            <button type="button" className="nav" onClick={onLeft}>&lt;</button>
            <div className="">{month.format('MMMM')}</div>
            <button type="button" className="nav" onClick={onRight}>&gt;</button>
        </div>
    );
};

MonthCell.propTypes = {
    onLeft: propTypes.func.isRequired,
    onRight: propTypes.func.isRequired,
    month: propTypes.instanceOf(moment).isRequired,
};

export default MonthCell;
