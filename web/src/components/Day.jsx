import React, { Component } from 'react';
import PropTypes from 'prop-types';

import moment from 'moment-timezone';

import '../styles/Day.css';

class Day extends Component {
    static propTypes = {
        day: PropTypes.instanceOf(moment).isRequired,
    }

    static generateHours(day) {
        const hours = [];
        const current = day.clone().startOf('day');
        const end = day.clone().add(1, 'day').startOf('day');
        while (end.diff(current, 'hours') > 0) {
            hours.push((
                <div key={`l-${current.unix()}`} className="hour">
                    {current.hour()}
                </div>
            ));
            hours.push(<div key={current.unix()} className="evHour" />);
            current.add(1, 'hour');
        }
        return hours;
    }

    render() {
        const { day } = this.props;
        return (
            <div className="calDay">
                { Day.generateHours(day) }
            </div>
        );
    }
}

export default Day;
