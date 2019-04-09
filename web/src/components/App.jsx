import React, { Component } from 'react';

import '../styles/App.css';
import MainCalendar from './MainCalendar';
import ChooseEventType from './ChooseEventType';

/**
 * Primary toplevel app component.
 * renders different toplevel components based on the nav state.
 */
class App extends Component {
    /**
     * App component keeps track of the current navigation in state.nav
     * default on page startup is main
     * see pickComp for the list of all nav states
     */
    state = {
        nav: 'main',
    }

    /**
     * Navigate to the createEvent form
     */
    navNewEvent = () => {
        this.setState({ nav: 'createEvent' });
    }

    /**
     * Navigate to the main calendar view
     */
    returnHome = () => {
        this.setState({ nav: 'main' });
        console.log('back to home');
    }

    /**
     * Helper function, picks the toplevel element
     * @param {nav} the component to navigate to
     * Returns the toplevel element
     */
    pickComp = (nav) => {
        switch (nav) {
        case 'createEvent':
            return <ChooseEventType returnHome={this.returnHome} />;
        case 'main':
        default:
            return <MainCalendar navNewEvent={this.navNewEvent} refreshHome={this.returnHome} />;
        }
    }

    /**
     * Main render function, renders a toplevel component based on the current nav state
     */
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
