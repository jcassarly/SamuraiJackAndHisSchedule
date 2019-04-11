import React from 'react';
import PropTypes from 'prop-types';
import Cookie from 'js-cookie';
import request from 'superagent';
import { connect } from 'react-redux';
import { syncFromAsync } from '../actions/sync';
import { Settings } from '../events/Settings';

import { modes, types } from './MainCalendar';
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
            .post('http://127.0.0.1:8000/proto/set') // TODO: remove hardocded URL
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
        // see propTypes
        const { navNewEvent, toggleMode, currMode, calType, syncFromAsync } = this.props;

        // if the user clicked logout, go to the logout URL
        if (logout) {
            this.setState({
                logout: false,
            });
            // TODO: remove hardcoded URL
            window.location.replace('http://127.0.0.1:8000/accounts/logout/');
        }

        const buttons = [
            <button key="new-ev" type="button" onClick={navNewEvent}>New Event</button>,
            <button key="logout" type="button" onClick={this.logout}>Logout</button>,
            <button key="sync-from" type="button" onClick={this.syncTo}>Sync To Server</button>,
            <button key="sync-to" type="button" onClick={syncFromAsync}>Sync From Server</button>,
        ];

        if (calType !== types.MONTH) {
            buttons.push(
                <button key="drag-drop" className={currMode === modes.DRAG_DROP ? 'selected' : ''} type="button" onClick={() => { toggleMode(modes.DRAG_DROP); }}>Drag&amp;Drop</button>,
            );
        }

        // contains buttons corresponding to possible actions the user can take using the toolbar
        return (
            <div className="toolbar">
                {buttons}
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
<<<<<<< HEAD
    toggleMode: PropTypes.func.isRequired,
    currMode: PropTypes.number.isRequired,
    calType: PropTypes.number.isRequired,
=======
    syncFromAsync: PropTypes.func.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    events: PropTypes.object.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    deadlines: PropTypes.object.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    settings: PropTypes.instanceOf(Settings).isRequired,
>>>>>>> jcassarly/server
};

const mapStateToProps = state => (
    {
        events: state.events.events,
        deadlines: state.events.deadlines,
        settings: state.settings.settings,
    }
);

export default connect(mapStateToProps, { syncFromAsync })(Toolbar);
