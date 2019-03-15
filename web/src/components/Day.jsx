import React, { Component } from 'react';
import PropTypes from 'prop-types';

import moment from 'moment-timezone';

import '../styles/Day.css';

class Day extends Component {
    static propTypes = {
        day: PropTypes.instanceOf(moment).isRequired,
        events: PropTypes.arrayOf(PropTypes.instanceOf(Event)).isRequired,
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
        const { day, events } = this.props;
        const dayStart = day.clone().startOf('day');
        const dayEnd = day.clone().endOf('day');
        const currEvents = events.filter(event => (
            moment(event.startTime).isBetween(dayStart, dayEnd)
            || moment(event.endTime).isBetween(dayStart, dayEnd)
        ));
        return (
            <div className="calDay">
                <div className="dayEvents">
                    {currEvents.map((event) => {
                        const virtualStart = moment.max(moment(event.startTime), dayStart);
                        const virtualEnd = moment.min(moment(event.endTime), dayEnd);
                        // convert to hours, then ems
                        const startPos = virtualStart.diff(dayStart, 'minutes') / 60 * 3;
                        const length = virtualEnd.diff(virtualStart, 'minutes') / 60 * 3;
                        return <div key={event.name} style={{ top: `${startPos}em`, height: `${length}em` }}>{event.name}</div>;
                    })}
                </div>
                <div className="calHours">
                    { Day.generateHours(day) }
                </div>
            </div>
        );
    }
}

export default Day;
