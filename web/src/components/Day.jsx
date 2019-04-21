/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import moment from 'moment-timezone';

import { Event } from '../share/events/Event';
import em from '../em2px';
import '../styles/Day.css';

/**
 * The component for displaying the schedule for a single day in the day view
 */
class Day extends Component {
    /**
     * tool: whether the user is currently using a tool that interracts with days
     * pasting: whether the user is trying to paste
     * resizing: whether the user is currently trying to resize
     * startSelected: whether the user has selected the start of the event when resizing
     * selectedEvent: the event currently being edited by the user
     * mouseMove: how far the mouse has moved
     * day: the day to be displayed
     * events: a list of all events, can be empty
     * mouseUpClose: returns a handler for mouse up events
     * mouseMoveClose: returns a handler for mouse move events
     * dragClose: returns a handler for dragging an event
     * resizeClose: returns a handler for resizing an event
     * clipClose: returns a handler for clipboard events
     * pasteClose: returns a handler for paste events
     * DayEvents: the component to render the events
     * hours: an array of hours with the hour and unix timestamp
     * onlyHours: whether to only display the hours, used for week view.
     * draggingEvent: info about whether there is an event being dragged
     *     and whether this day controls it, see Day class
     */
    static propTypes = {
        tool: PropTypes.bool.isRequired,
        pasting: PropTypes.bool.isRequired,
        resizing: PropTypes.bool.isRequired,
        startSelected: PropTypes.bool.isRequired,
        selectedEvent: PropTypes.instanceOf(Event),
        mouseMove: PropTypes.number.isRequired,
        day: PropTypes.instanceOf(moment).isRequired,
        events: PropTypes.arrayOf(PropTypes.instanceOf(Event)).isRequired,
        mouseUpClose: PropTypes.func.isRequired,
        mouseMoveClose: PropTypes.func.isRequired,
        dragClose: PropTypes.func.isRequired,
        resizeClose: PropTypes.func.isRequired,
        clipClose: PropTypes.func.isRequired,
        pasteClose: PropTypes.func.isRequired,
        DayEvents: PropTypes.func.isRequired,
        hours: PropTypes.arrayOf(PropTypes.shape({
            hour: PropTypes.number,
            unix: PropTypes.number,
        })).isRequired,
        onlyHours: PropTypes.bool,
        draggingEvent: PropTypes.shape({
            initialPos: PropTypes.number,
            event: PropTypes.instanceOf(Event),
            selected: PropTypes.bool,
            diff: PropTypes.number,
        }).isRequired,
    }

    static defaultProps = {
        selectedEvent: null,
        onlyHours: false,
    }

    // converts from px to ems, then to hours since each hour is 3 ems tall
    static pxToHours = px => px / em / 3;

    /**
     * helper method
     * gets the correct clientY whether passed in a click or touch event
     */
    static getYPos(e) {
        let yPos;
        if (e.touches) {
            yPos = e.touches[0].clientY;
        } else {
            yPos = e.clientY;
        }
        return yPos;
    }

    render() {
        // see propTypes
        const {
            // current user interaction
            tool,
            pasting,
            resizing,
            startSelected,
            selectedEvent,
            mouseMove,
            // calendar info
            day,
            events,
            // event handler closures
            mouseUpClose,
            mouseMoveClose,
            dragClose,
            resizeClose,
            clipClose,
            pasteClose,
            // components to render
            DayEvents,
            hours,
            onlyHours,
            draggingEvent,
        } = this.props;

        // pass in web specific functions to help with handlers
        const onMouseUp = mouseUpClose(
            Day.pxToHours,
            (e) => { e.preventDefault(); },
        );
        const onMouseMove = mouseMoveClose(
            Day.getYPos,
            (e) => { e.preventDefault(); },
        );
        const dragClosure = dragClose(
            Day.getYPos,
            (e) => { e.preventDefault(); },
        );
        const resizeClosure = resizeClose(
            Day.getYPos,
            (e) => { e.preventDefault(); },
        );
        const onPaste = pasteClose(
            Day.pxToHours,
            // gets the y position relative to the calHours element
            e => Day.getYPos(e) - e.currentTarget.getBoundingClientRect().top,
        );

        return (
            <div
                className={`calDay ${tool ? 'tool' : ''} ${pasting ? 'paste' : ''} ${onlyHours ? 'onlyHours' : ''}`}
                onMouseMove={onMouseMove}
                onMouseUp={onMouseUp}
                onTouchMove={onMouseMove}
                onTouchEnd={onMouseUp}
                onTouchCancel={onMouseUp}
            >
                <DayEvents
                    day={day}
                    events={events}
                    resizing={resizing}
                    selectedEvent={selectedEvent}
                    startSelected={startSelected}
                    mouseMove={mouseMove}
                    mouseDownClosureDrag={dragClosure}
                    mouseDownClosureResize={resizeClosure}
                    clipboardClosure={clipClose}
                    pxToHours={Day.pxToHours}
                    draggingEvent={draggingEvent}
                />
                <div className="calHours" onClick={onPaste}>
                    { hours.map(hour => [
                        // div for displaying the actual hour number
                        <div key={`l-${hour.unix}`} className="hour">
                            {hour.hour}
                        </div>,
                        // div for displaying the hour blocks
                        <div key={hour.unix} className="evHour" />,
                    ]).flat() }
                </div>
            </div>
        );
    }
}

export default Day;
