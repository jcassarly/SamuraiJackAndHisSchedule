import React from 'react';
import PropTypes from 'prop-types';
import { Event } from '../events/Event';

import '../styles/MonthCell.css';

const MonthCell = (props) => {
    const { current, date, events } = props;
    return (
        <div className={`monthCell ${(current ? 'current' : '')}`}>
            <div className="monthDay">{date}</div>
            {events.map(event => (
                <div key={event.name} className="monthEvent">{event.name}</div>
            ))}
        </div>
    );
};

MonthCell.propTypes = {
    current: PropTypes.bool,
    date: PropTypes.number.isRequired,
    events: PropTypes.arrayOf(PropTypes.instanceOf(Event)),
};

MonthCell.defaultProps = {
    current: false,
    events: [],
};

export default MonthCell;
