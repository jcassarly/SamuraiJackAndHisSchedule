import React, { Component } from 'react';

import addMonths from 'date-fns/add_months';
import subMonths from 'date-fns/sub_months';

import '../styles/App.css';
import MainCalendar from './MainCalendar';
import MonthHeader from './MonthHeader';

class App extends Component {
    state = {
        month: new Date(),
        pos: 0, // eslint-disable-line react/no-unused-state
    };

    onLeft = () => {
        const { month } = this.state;
        this.setState({ month: subMonths(month, 1) });
    }

    onRight = () => {
        const { month } = this.state;
        this.setState({ month: addMonths(month, 1) });
    }

    render() {
        const { month } = this.state;
        return (
            <div className="monthHome">
                <MonthHeader month={month} onLeft={this.onLeft} onRight={this.onRight} />
                <div className="calendars">
                    <div className="calendarSlider">
                        <MainCalendar id={month.getMonth() - 1} month={subMonths(month, 1)} />
                        <MainCalendar id={month.getMonth()} month={month} />
                        <MainCalendar id={month.getMonth() + 1} month={addMonths(month, 1)} />
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
