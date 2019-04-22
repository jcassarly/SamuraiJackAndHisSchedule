import React from 'react';
import PropTypes from 'prop-types';

import { modes, types } from './MainCalendar';

import BaseElem from '../../components/BaseElem';
import Toolbar from '../../components/Toolbar';
import ToolbarButton, { ToolbarSideMenu } from '../../components/ToolbarButton';

/**
 * Class to represent the Toolbar on the homscreen
 */
function ToolbarController(props) {
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
        <ToolbarButton key="new-ev" click={navNewEvent}>New Event</ToolbarButton>,
        <ToolbarButton key="cut" selected={currMode === modes.CUT} click={() => { toggleMode(modes.CUT); }}>cut</ToolbarButton>,
        <ToolbarButton key="copy" selected={currMode === modes.COPY} click={() => { toggleMode(modes.COPY); }}>copy</ToolbarButton>,
        <ToolbarButton key="paste" selected={currMode === modes.PASTE} click={() => { toggleMode(modes.PASTE); }}>paste</ToolbarButton>,
        <ToolbarSideMenu key="side-menu" type="button" onClick={toggleSideMenu}>
            <BaseElem>
                <BaseElem className="hamburger" />
                <BaseElem className="hamburger" />
                <BaseElem className="hamburger" />
            </BaseElem>
        </ToolbarSideMenu>,
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
    toggleSideMenu: PropTypes.func.isRequired,
};

export default ToolbarController;
