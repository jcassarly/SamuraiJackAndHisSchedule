import React, { Component } from 'react';

import moment from 'moment';

import '../styles/App.css';
import MainCalendar from './MainCalendar';
import MonthHeader from './MonthHeader';

class App extends Component {
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

    render() {
        const { month } = this.state;
        return (
            <div className="monthHome">
                <MonthHeader month={month} onLeft={this.onLeft} onRight={this.onRight} />
                <div className="calendars">
                    <div className="calendarSlider">
                        <MainCalendar id={month.month() - 1} month={month.clone().subtract(1, 'months')} />
                        <MainCalendar id={month.month()} month={month} />
                        <MainCalendar id={month.month() + 1} month={month.clone().add(1, 'months')} />
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
