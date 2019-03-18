import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import moment from 'moment-timezone';

import '../styles/MainCalendar.css';
import { Event } from '../events/Event';

import CalHeader from './CalHeader';
import Toolbar from './Toolbar';
import Month from './Month';
import Week from './Week';
import Day from './Day';

class MainCalendar extends Component {
    startPos = 0;

    types = ['month', 'week', 'day'];

    /* static propTypes = {
        events: PropTypes.arrayOf(PropTypes.instanceOf(Event)).isRequired,
    }; */

    state = {
        date: moment().tz(moment.tz.guess()),
        pos: 0,
        type: this.types[0],
    };

    onLeft = () => {
        const { date, type } = this.state;
        this.setState({ date: date.clone().subtract(1, type) });
    }

    onRight = () => {
        const { date, type } = this.state;
        this.setState({ date: date.clone().add(1, type) });
    }

    onSwitch = () => {
        const { type } = this.state;
        this.setState({ type: this.types[(this.types.indexOf(type) + 1) % this.types.length] });
    }

    beginScroll = (e) => {
        this.startPos = e.touches[0].pageY;
    }

    scroll = (e) => {
        this.setState({ pos: e.touches[0].pageY - this.startPos });
    }

    endScroll = () => {
        this.setState({ pos: 0 });
    }

    render() {
        const { date, pos, type } = this.state;
        const { navNewEvent } = this.props;
        const events = Object.values(this.props.events);
        let calElem;

        switch (type) {
        case 'day':
            calElem = <Day events={events} day={date} />;
            break;
        case 'week':
            calElem = <Week events={events} week={date} />;
            break;
        default:
        case 'month':
            calElem = (
                <div className="calendarSlider" style={{ display: 'block' }}>
                    <div
                        className="slideContainer"
                        onTouchStart={this.beginScroll}
                        onTouchMove={this.scroll}
                        onTouchEnd={this.endScroll}
                        onTouchCancel={this.endScroll}
                    >
                        <div className="calContainer" style={{ top: `${pos}px` }}>
                            <Month events={events} id={date.month()} month={date} />
                        </div>
                    </div>
                </div>
            );
        }
        return (
            <div className="calHome">
                <CalHeader
                    type={type}
                    date={date}
                    onLeft={this.onLeft}
                    onRight={this.onRight}
                    onSwitch={this.onSwitch}
                />
                <Toolbar navNewEvent={navNewEvent} />
                {calElem}
            </div>
        );
    }
}

const mapStateToProps = state => (
    {
        events: state.events.events,
    }
);

export default connect(mapStateToProps)(MainCalendar);
