import React from 'react';

import '../styles/MonthCell.css';

const MonthCell = props => {
    return (
        <div className={"monthCell " + (props.current ? "current" : "") }>
            <div className="monthDay">{props.date.getDate()}</div>
        </div>
    );
}

export default MonthCell
