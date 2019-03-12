import React, { Component } from 'react';

import moment from 'moment-timezone';

import '../styles/MainCalendar.css';
import CalHeader from './CalHeader';
import Month from './Month';
import Day from './Day';

class MainCalendar extends Component {
    startPos = 0;

    types = ['month', 'day'];

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
        this.setState({ type: this.types[(this.types.indexOf(type) + 1) % 2] });
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
        let calElem;

        switch (type) {
        case 'day':
            calElem = <Day day={date} />;
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
                            <Month id={date.month()} month={date} />
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
                {calElem}
            </div>
        );
    }
}

export default MainCalendar;
