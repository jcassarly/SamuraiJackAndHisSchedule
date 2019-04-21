import React, { Component } from 'react';

import MainCalendar from './MainCalendar';
import ChooseEventType from './ChooseEventType';
import SettingsForm from './SettingsForm';
import App from '../../components/App';

/**
 * Primary toplevel app component.
 * renders different toplevel components based on the nav state.
 */
class AppController extends Component {
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
     * Navigate to the SettingsForm
     */
    navSettings = () => {
        this.setState({ nav: 'settings' });
        console.log('to Settings Menu');
    }

    /**
     * Navigate to the main calendar view
     */
    returnHome = () => {
        this.setState({ nav: 'main' });
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
        case 'settings':
            return <SettingsForm returnHome={this.returnHome} />;
        case 'main':
        default:
            return <MainCalendar navNewEvent={this.navNewEvent} navSettings={this.navSettings} />;
        }
    }

    /**
     * Main render function, renders a toplevel component based on the current nav state
     */
    render() {
        const { nav } = this.state;
        return (
            <App>
                {this.pickComp(nav)}
            </App>
        );
    }
}
export default AppController;
