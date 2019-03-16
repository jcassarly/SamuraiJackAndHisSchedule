import React, { Component } from 'react';
import '../styles/App.css';
import StandardEventForm from './StandardEventForm'
import ChooseEventTypeForm from './ChooseEventType'
import SettingsForm from './SettingsForm'
import MainCalendar from './MainCalendar'
import MonthHeader from './MonthHeader'

import addMonths from 'date-fns/add_months'
import subMonths from 'date-fns/sub_months'

class App extends Component {
    /*state = {
        month: new Date(),
        pos: 0,
    };

    onLeft = () => {
        this.setState({month: subMonths(this.state.month, 1)})
    }

    onRight = () => {
       this.setState({month: addMonths(this.state.month, 1)})
    }*/

    render() {
        return <ChooseEventTypeForm />;
        /*return (
            <div className="monthHome">
                <MonthHeader month={this.state.month} onLeft={this.onLeft} onRight={this.onRight} />
                <div className="calendars">
                    <div className="calendarSlider">
                        <MainCalendar id={this.state.month.getMonth() - 1} month={subMonths(this.state.month, 1)} />
                        <MainCalendar id={this.state.month.getMonth()} month={this.state.month} />
                        <MainCalendar id={this.state.month.getMonth() + 1} month={addMonths(this.state.month, 1)} />
                    </div>
                </div>
            </div>
        );*/
    }
}

export default App;
