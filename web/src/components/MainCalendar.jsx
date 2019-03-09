import React, { Component } from 'react';

import moment from 'moment';

import '../styles/MainCalendar.css';
import MonthHeader from './MonthHeader';
import Month from './Month';

class MainCalendar extends Component {
    startPos = 0;

    state = {
        month: moment(),
        pos: 0, // eslint-disable-line react/no-unused-state
    };

    onLeft = () => {
        const { month } = this.state;
        this.setState({ month: month.clone().subtract(1, 'months') });
    }

    onRight = () => {
        const { month } = this.state;
        this.setState({ month: month.clone().add(1, 'months') });
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
        const { month, pos } = this.state;
        return (
            <div className="monthHome">
                <MonthHeader month={month} onLeft={this.onLeft} onRight={this.onRight} />
                <div className="calendarSlider">
                    <div
                        className="slideContainer"
                        onTouchStart={this.beginScroll}
                        onTouchMove={this.scroll}
                        onTouchEnd={this.endScroll}
                        onTouchCancel={this.endScroll}
                    >
                        <div className="calContainer" style={{ top: `${pos}px` }}>
                            <Month id={month.month()} month={month} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default MainCalendar;
