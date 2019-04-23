import React from 'react';
import PropTypes from 'prop-types';
import Cookie from 'js-cookie';
import SideMenu from '../../components/SideMenu';
import SideMenuButton from '../../components/SideMenuButton';
import BaseElem from '../../components/BaseElem';

class SideMenuController extends React.Component {
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
            style,
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
            <SideMenu style={style}>
                <BaseElem className="sidemenubaseelem">{`Username: ${Cookie.get('username')}`}</BaseElem>
                <SideMenuButton onClick={this.logout}>Logout</SideMenuButton>
                <SideMenuButton onClick={syncTo}>{'Sync To Server (<S>)'}</SideMenuButton>
                <SideMenuButton onClick={syncFrom}>{'Sync From Server (<L>)'}</SideMenuButton>
                <SideMenuButton onClick={navSettings}>Settings</SideMenuButton>
            </SideMenu>
        );
    }
}

SideMenuController.propTypes = {
    navSettings: PropTypes.func.isRequired,
    syncTo: PropTypes.func.isRequired,
    syncFrom: PropTypes.func.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    style: PropTypes.any.isRequired,
};

export default SideMenuController;
