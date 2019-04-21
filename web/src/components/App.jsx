import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Cookie from 'js-cookie';
import request from 'superagent';
import { connect } from 'react-redux';
import { syncFromAsync } from '../actions/sync';
import { Settings } from '../events/Settings';
import { serializeSyncPayload } from '../reducers/events';

import '../styles/App.css';
import MainCalendar from './MainCalendar';
import ChooseEventType from './ChooseEventType';
import SettingsForm from './SettingsForm';
import SideMenu from './SideMenu';

const SIDE_MENU_SIZE = 250;

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
        sideMenu: false,
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

    closeSideMenuOnClick = (event) => {
        const { sideMenu } = this.state;

        if (sideMenu && event.clientX < document.body.clientWidth - SIDE_MENU_SIZE) {
            this.toggleSideMenu();
        }
    }

    handleKeyPress = (event) => {
        const { syncFromAsync } = this.props;

        if (event.key === 'l') {
            syncFromAsync();
        } else if (event.key === 's') {
            this.syncTo();
        }
    }

    toggleSideMenu = () => {
        const { sideMenu } = this.state;

        this.setState({
            sideMenu: !sideMenu,
        });

        if (!sideMenu) {
            document.getElementById('hm').style.width = `${SIDE_MENU_SIZE}px`;
        } else {
            document.getElementById('hm').style.width = '0px';
        }
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
            return (
                <MainCalendar
                    navNewEvent={this.navNewEvent}
                    navSettings={this.navSettings}
                    toggleSideMenu={this.toggleSideMenu}
                />
            );
        }
    }

    /**
     * Sends the current events and deadlines in the redux store to the server
     * Overwrites whatever was saved on the user's account
     */
    syncTo() {
        const {
            username,
            events,
            deadlines,
            settings,
        } = this.props;

        // send the data to the server
        request
            .post('/proto/set')
            .set('X-CSRFToken', unescape(Cookie.get('csrftoken'))) // for security
            .set('Content-Type', 'application/json') // sending a JSON object
            .send(serializeSyncPayload(username, events, deadlines, settings))
            .then((res) => {
            // echo the response on the console
                console.log(res.text);
            });
    }

    /**
     * Main render function, renders a toplevel component based on the current nav state
     */
    render() {
        const { nav } = this.state;
        const { syncFromAsync, username } = this.props;

        return (
            <div
                id="main"
                className="app"
                onClick={this.closeSideMenuOnClick}
                onKeyPress={this.handleKeyPress}
                role="button"
                tabIndex={0}
            >
                {this.pickComp(nav)}
                <SideMenu
                    navSettings={this.navSettings}
                    syncTo={this.syncTo}
                    syncFrom={syncFromAsync}
                    username={username}
                />
            </div>
        );
    }
}

App.propTypes = {
    username: PropTypes.string.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    events: PropTypes.object.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    deadlines: PropTypes.object.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    settings: PropTypes.instanceOf(Settings).isRequired,
    syncFromAsync: PropTypes.func.isRequired,
};

const mapStateToProps = state => (
    {
        username: state.username,
        events: state.events.events,
        deadlines: state.events.deadlines,
        settings: state.settings.settings,
    }
);

export default connect(mapStateToProps, { syncFromAsync })(App);
