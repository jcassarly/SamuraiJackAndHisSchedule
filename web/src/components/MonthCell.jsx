import React, { Component } from 'react';
import propTypes from 'prop-types';

import moment from 'moment';

import '../styles/MonthCell.css';

class MonthCell extends Component {
    shouldComponentUpdate(nextProps) {
        const { current, date } = this.props;
        return nextProps.current !== current || nextProps.date.diff(date, 'days') !== 0;
    }

    render() {
        const { current, date } = this.props;
        return (
            <div className={`monthCell ${(current ? 'current' : '')}`}>
                <div className="monthDay">{date.date()}</div>
            </div>
        );
    }
}

MonthCell.propTypes = {
    current: propTypes.bool,
    date: propTypes.instanceOf(moment).isRequired,
};

MonthCell.defaultProps = {
    current: false,
};

export default MonthCell;
