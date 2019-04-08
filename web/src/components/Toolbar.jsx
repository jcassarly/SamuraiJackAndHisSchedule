import React from 'react';
import PropTypes from 'prop-types';
import Cookie from 'js-cookie';
import { connect } from 'react-redux';

import '../styles/Toolbar.css';

const request = require('superagent');
// const csrf = require('superagent-csrf-middleware');

class Toolbar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            logout: false,
        };

        this.logout = this.logout.bind(this);
        this.syncTo = this.syncTo.bind(this);
        this.syncFrom = this.syncFrom.bind(this);
    }

    logout() {
        this.setState({
            logout: true,
        });
    }

    syncTo() {
        // eslint-disable-next-line no-unused-vars
        // eslint-disable-next-line react/prop-types
        const { events, deadlines } = this.props;

        const syncData = JSON.stringify({
            events: JSON.stringify(events),
            deadlines: JSON.stringify(deadlines),
        });
        console.log('Hello');
        console.log(syncData);
        request
            .post('http://127.0.0.1:8000/proto/set')
            .set('X-CSRFToken', unescape(Cookie.get('csrftoken')))
            .set('Content-Type', 'application/json')
            .send(syncData)
            .then((res) => {
                console.log(res.text);
            });
        // alert(logout);
    }

    syncFrom() {
        // eslint-disable-next-line no-unused-vars
        const { logout } = this.state;
        request
            .post('http://127.0.0.1:8000/proto/get')
            .set('X-CSRFToken', unescape(Cookie.get('csrftoken')))
            .set('Content-Type', 'application/json')
            .then((res) => {
                console.log(res.text);
            });
    }

    render() {
        const { logout } = this.state;

        if (logout) {
            this.setState({
                logout: false,
            });
            window.location.replace('http://127.0.0.1:8000/accounts/logout/');
        }

        // see propTypes
        const { navNewEvent } = this.props;
        // contains buttons corresponding to possible actions the user can take using the toolbar
        return (
            <div className="toolbar">
                <button type="button" onClick={navNewEvent}>New Event</button>
                <button type="button" onClick={this.logout}>Logout</button>
                <button type="button" onClick={this.syncTo}>Sync To Server</button>
                <button type="button" onClick={this.syncFrom}>Sync From Server</button>
            </div>
        );
    }
}

/**
 * navNewEvent: navigates to the form for creating a new event
 */
Toolbar.propTypes = {
    navNewEvent: PropTypes.func.isRequired,
};

const mapStateToProps = state => (
    {
        events: state.events.events,
        deadlines: state.events.deadlines,
        // settings: state.settings.settings,
    }
);

export default connect(mapStateToProps)(Toolbar);
