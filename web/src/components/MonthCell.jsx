import React from 'react';
import propTypes from 'prop-types';

import '../styles/MonthCell.css';

const MonthCell = (props) => {
    const { current, date } = props;
    return (
        <div className={`monthCell ${(current ? 'current' : '')}`}>
            <div className="monthDay">{date.getDate()}</div>
        </div>
    );
};

MonthCell.propTypes = {
    current: propTypes.bool,
    date: propTypes.instanceOf(Date).isRequired,
};

MonthCell.defaultProps = {
    current: false,
};

export default MonthCell;
