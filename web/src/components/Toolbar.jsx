import React, { Component } from 'react';

import '../styles/Toolbar.css';

class Toolbar extends Component {
    render() {
        const { navNewEvent } = this.props;
        return (
            <div className="toolbar">
               <button onClick={navNewEvent}>New Event</button>
            </div>
        );
    }
}

export default Toolbar;