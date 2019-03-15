import React from 'react';
import propTypes from 'prop-types';

import format from 'date-fns/format';

import '../styles/MonthHeader.css';

const MonthCell = (props) => {
    const { onLeft, onRight, month } = props;
    return (
        <div className="monthHeader">
            <button type="button" className="nav" onClick={onLeft}>&lt;</button>
            <div className="">{format(month, 'MMMM')}</div>
            <button type="button" className="nav" onClick={onRight}>&gt;</button>
        </div>
    );
};

MonthCell.propTypes = {
    onLeft: propTypes.func.isRequired,
    onRight: propTypes.func.isRequired,
    month: propTypes.instanceOf(Date).isRequired,
};

export default MonthCell;
