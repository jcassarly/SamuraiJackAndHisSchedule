import React from 'react';
import { Redirect } from 'react-router-dom';
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

    renderLogout() {
        const { logout } = this.state;
        if (logout) {
            return <Redirect to="/accounts/logout/" />;
        }

        return null;
    }

    render() {
        const { navNewEvent } = this.props;
        return (
            <div className="toolbar">
                {/* this.renderLogout() */}
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
