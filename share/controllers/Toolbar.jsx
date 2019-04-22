import React from 'react';
import PropTypes from 'prop-types';
import Cookie from 'js-cookie';
import request from 'superagent';
import { connect } from 'react-redux';
import { syncFromAsync } from '../actions/sync';
import { Settings } from '../events/Settings';
import { serializeSyncPayload } from '../reducers/events';

import { modes, types } from './MainCalendar';

import Toolbar from '../../components/Toolbar';
import ToolbarButton from '../../components/ToolbarButton';

/**
 * Class to represent the Toolbar on the homscreen
 */
class ToolbarController extends React.Component {
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

        // send the data to the server
        request
            .post('/proto/set')
            .set('X-CSRFToken', unescape(Cookie.get('csrftoken'))) // for security
            .set('Content-Type', 'application/json') // sending a JSON object
            .send(serializeSyncPayload(events, deadlines, settings))
            .then((res) => {
            // echo the response on the console
                console.log(res.text);
            });
    }

    /**
     * Render the Toolbar object
     */
    render() {
        // see state definition
        const { logout } = this.state;
        // see propTypes
        const {
            navNewEvent,
            toggleMode,
            currMode,
            calType,
            syncFromAsync,
            navSettings,
        } = this.props;

        // if the user clicked logout, go to the logout URL
        if (logout) {
            this.setState({
                logout: false,
            });
            localStorage.removeItem('state');
            window.location.pathname = '/accounts/logout/';
        }

        // add buttons
        const buttons = [
            <ToolbarButton key="new-ev" click={navNewEvent}>New Event</ToolbarButton>,
            <ToolbarButton key="logout" click={this.logout}>Logout</ToolbarButton>,
            <ToolbarButton key="sync-from" click={this.syncTo}>Sync To Server</ToolbarButton>,
            <ToolbarButton key="sync-to" click={syncFromAsync}>Sync From Server</ToolbarButton>,
            <ToolbarButton key="general-settings" click={navSettings}>General Settings</ToolbarButton>,
            <ToolbarButton key="cut" selected={currMode === modes.CUT} click={() => { toggleMode(modes.CUT); }}>cut</ToolbarButton>,
            <ToolbarButton key="copy" selected={currMode === modes.COPY} click={() => { toggleMode(modes.COPY); }}>copy</ToolbarButton>,
            <ToolbarButton key="paste" selected={currMode === modes.PASTE} click={() => { toggleMode(modes.PASTE); }}>paste</ToolbarButton>,
            <ToolbarButton key="edit-event" selected={currMode === modes.EDIT} click={() => { toggleMode(mode.EDIT); }}></ToolbarButton>,
        ];

        // add buttons that don't appear when in month view
        if (calType !== types.MONTH) {
            buttons.push(
                <ToolbarButton key="drag-drop" selected={currMode === modes.DRAG_DROP} click={() => { toggleMode(modes.DRAG_DROP); }}>Drag&amp;Drop</ToolbarButton>,
                <ToolbarButton key="resize" selected={currMode === modes.RESIZE} click={() => { toggleMode(modes.RESIZE); }}>Resize</ToolbarButton>,
            );
        }

        // contains buttons corresponding to possible actions the user can take using the toolbar
        return (
            <Toolbar>
                {buttons}
            </Toolbar>
        );
    }
}

/**
 * navNewEvent: navigates to the form for creating a new event
 * toggleMode: toggles the mode of the calendar (eg. drag/drop mode, resize, etc.)
 * currMode: the current mode that the calednar is in
 * calType: the type of calendar being displayed
 * syncFromAsync: pulls the events from the server to the redux store
 * events: the list of events from the redux store
 * deadlines: the list of deadlines from the redux store
 * settings: the settings object from the redux store
 * navSettings: navigates to the form for managing settings
 */
ToolbarController.propTypes = {
    navNewEvent: PropTypes.func.isRequired,
    toggleMode: PropTypes.func.isRequired,
    currMode: PropTypes.number.isRequired,
    calType: PropTypes.number.isRequired,
    syncFromAsync: PropTypes.func.isRequired,   
    // eslint-disable-next-line react/forbid-prop-types
    events: PropTypes.object.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    deadlines: PropTypes.object.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    settings: PropTypes.instanceOf(Settings).isRequired,
    navSettings: PropTypes.func.isRequired,
};

const mapStateToProps = state => (
    {
        events: state.events.events,
        deadlines: state.events.deadlines,
        settings: state.settings.settings,
    }
);

export default connect(mapStateToProps, { syncFromAsync })(ToolbarController);
