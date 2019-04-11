import React from 'react';
import PropTypes from 'prop-types';
import Cookie from 'js-cookie';
import request from 'superagent';
import { connect } from 'react-redux';
import { syncFromAsync } from '../actions/sync';
import { Settings } from '../events/Settings';

import '../styles/Toolbar.css';

/**
 * Class to represent the Toolbar on the homscreen
 */
class Toolbar extends React.Component {
    /**
     * Create a new user
     * @param {*} props the arguments passed into the Toolbar
     *                  see proptypes below for more info
     */
    constructor(props) {
        super(props);

        this.state = {
            logout: false,
        };

        this.logout = this.logout.bind(this);
        this.syncTo = this.syncTo.bind(this);
    }

    /**
     * Set the state to signify that the user clicked the logout button
     */
    logout() {
        this.setState({
            logout: true,
        });
    }

    /**
     * Sends the current events and deadlines in the redux store to the server
     * Overwrites whatever was saved on the user's account
     */
    syncTo() {
        const { events, deadlines, settings } = this.props;

        // serialize the events
        const eventsClone = {};
        Object.keys(events).forEach((key) => {
            eventsClone[key] = JSON.stringify(events[key].serialize());
        });

        // serialize the deadlines
        const deadlinesClone = {};
        Object.keys(deadlines).forEach((key) => {
            deadlinesClone[key] = JSON.stringify(deadlines[key].serialize());
        });

        // takes the serialized lists and settings and combine them into one object
        const syncData = JSON.stringify({
            events: JSON.stringify(eventsClone),
            deadlines: JSON.stringify(deadlinesClone),
            settings: JSON.stringify(settings.serialize()),
        });

        // send the data to the server
        request
            .post('/proto/set')
            .set('X-CSRFToken', unescape(Cookie.get('csrftoken'))) // for security
            .set('Content-Type', 'application/json') // sending a JSON object
            .send(syncData)
            .then((res) => {
                // echo the response on the console
                console.log(res.text);
            });
    }

    /**
     * Render the Toolbar object
     */
    render() {
        const { logout } = this.state;

        // if the user clicked logout, go to the logout URL
        if (logout) {
            this.setState({
                logout: false,
            });
            window.location.pathname = '/accounts/logout/';
        }

        // see propTypes
        // eslint-disable-next-line no-shadow
        const { navNewEvent, syncFromAsync } = this.props;
        // contains buttons corresponding to possible actions the user can take using the toolbar
        return (
            <div className="toolbar">
                <button type="button" onClick={navNewEvent}>New Event</button>
                <button type="button" onClick={this.logout}>Logout</button>
                <button type="button" onClick={this.syncTo}>Sync To Server</button>
                <button type="button" onClick={syncFromAsync}>Sync From Server</button>
            </div>
        );
    }
}

/**
 * navNewEvent: navigates to the form for creating a new event
 * syncFromAsync: pulls the events from the server to the redux store
 * events: the list of events from the redux store
 * deadlines: the list of deadlines from the redux store
 * settings: the settings object from the redux store
 */
Toolbar.propTypes = {
    navNewEvent: PropTypes.func.isRequired,
    syncFromAsync: PropTypes.func.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    events: PropTypes.object.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    deadlines: PropTypes.object.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    settings: PropTypes.instanceOf(Settings).isRequired,
};

const mapStateToProps = state => (
    {
        events: state.events.events,
        deadlines: state.events.deadlines,
        settings: state.settings.settings,
    }
);

export default connect(mapStateToProps, { syncFromAsync })(Toolbar);
