import React from 'react';
import PropTypes from 'prop-types';

import '../styles/Toolbar.css';

class Toolbar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            logout: false,
        };

        this.logout = this.logout.bind(this);
    }

    logout() {
        this.setState({
            logout: true,
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

        const { navNewEvent } = this.props;
        return (
            <div className="toolbar">
                <button type="button" onClick={navNewEvent}>New Event</button>
                <button type="button" onClick={this.logout}>Logout</button>
            </div>
        );
    }
}

Toolbar.propTypes = {
    navNewEvent: PropTypes.func.isRequired,
};

export default Toolbar;
