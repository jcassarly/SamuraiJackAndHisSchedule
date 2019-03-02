import React from 'react';

import format from 'date-fns/format'

import '../styles/MonthHeader.css';

const MonthCell = props => {
    return (
        <div className="monthHeader">
            <div className="nav" onClick={props.onLeft}>&lt;</div>
            <div className="">{format(props.month, 'MMMM')}</div>
            <div className="nav" onClick={props.onRight}>&gt;</div>
        </div>
    );
}

export default MonthCell
