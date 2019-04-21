import React from 'react';
import PropTypes from 'prop-types';

import { modes, types } from './MainCalendar';
import '../styles/Toolbar.css';

/**
 * Class to represent the Toolbar on the homscreen
 */
function Toolbar(props) {
    // see propTypes
    const {
        navNewEvent,
        toggleMode,
        currMode,
        calType,
        toggleSideMenu,
    } = props;

    // add buttons
    const buttons = [
        <button key="new-ev" type="button" onClick={navNewEvent}>New Event</button>,
        <button key="cut" className={currMode === modes.CUT ? 'selected' : ''} type="button" onClick={() => { toggleMode(modes.CUT); }}>cut</button>,
        <button key="copy" className={currMode === modes.COPY ? 'selected' : ''} type="button" onClick={() => { toggleMode(modes.COPY); }}>copy</button>,
        <button key="paste" className={currMode === modes.PASTE ? 'selected' : ''} type="button" onClick={() => { toggleMode(modes.PASTE); }}>paste</button>,
    ];

    // add buttons that don't appear when in month view
    if (calType !== types.MONTH) {
        buttons.push(
            <button key="drag-drop" className={currMode === modes.DRAG_DROP ? 'selected' : ''} type="button" onClick={() => { toggleMode(modes.DRAG_DROP); }}>Drag&amp;Drop</button>,
            <button key="resize" className={currMode === modes.RESIZE ? 'selected' : ''} type="button" onClick={() => { toggleMode(modes.RESIZE); }}>Resize</button>,
        );
    }

    // contains buttons corresponding to possible actions the user can take using the toolbar
    return (
        <div className="toolbar">
            {buttons}
            <button key="side-menu" className="sideMenuButton" type="button" onClick={toggleSideMenu}>
                <div>
                    <div className="hamburger" />
                    <div className="hamburger" />
                    <div className="hamburger" />
                </div>
            </button>
        </div>
    );
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
 * toggleSideMenu: function to open or close th side menu
 */
Toolbar.propTypes = {
    navNewEvent: PropTypes.func.isRequired,
    toggleMode: PropTypes.func.isRequired,
    currMode: PropTypes.number.isRequired,
    calType: PropTypes.number.isRequired,
    toggleSideMenu: PropTypes.func.isRequired,
};

export default Toolbar;
