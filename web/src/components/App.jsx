import React, { Component } from 'react';

import '../styles/App.css';
import MainCalendar from './MainCalendar';
import ChooseEventType from './ChooseEventType';

class App extends Component {
    state = {
        nav: 'main',
    }

    navNewEvent = () => {
        this.setState({ nav: 'createEvent' });
    }

    returnHome = () => {
        this.setState({ nav: 'main' });
    }

    pickComp = (nav) => {
        switch (nav) {
        case 'createEvent':
            return <ChooseEventType returnHome={this.returnHome} />;
        case 'main':
        default:
            return <MainCalendar navNewEvent={this.navNewEvent} />;
        }
    }

    render() {
        const { nav } = this.state;
        return (
            <div className="app">
                {this.pickComp(nav)}
            </div>
        );
    }
}
export default App;
