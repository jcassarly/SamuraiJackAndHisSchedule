import React from 'react';
import PropTypes from 'prop-types';
import Cookie from 'js-cookie';

import '../styles/SideMenu.css';

class SideMenu extends React.Component {
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
    }

    /**
     * Set the state to signify that the user clicked the logout button
     */
    logout() {
        this.setState({
            logout: true,
        });
    }

    render() {
        const {
            navSettings,
            syncTo,
            syncFrom,
        } = this.props;
        const { logout } = this.state;

        // if the user clicked logout, go to the logout URL
        if (logout) {
            this.setState({
                logout: false,
            });
            localStorage.removeItem('state');
            window.location.pathname = '/accounts/logout/';
        }

        return (
            <div id="hm" className="sidemenu">
                <div>{`Username: ${Cookie.get('username')}`}</div>
                <button type="button" onClick={this.logout}>Logout</button>
                <button type="button" onClick={syncTo}>{'Sync To Server (<S>)'}</button>
                <button type="button" onClick={syncFrom}>{'Sync From Server (<L>)'}</button>
                <button type="button" onClick={navSettings}>Settings</button>
            </div>
        );
    }
}

SideMenu.propTypes = {
    navSettings: PropTypes.func.isRequired,
    syncTo: PropTypes.func.isRequired,
    syncFrom: PropTypes.func.isRequired,
};

export default SideMenu;
