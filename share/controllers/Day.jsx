import React, { Component } from 'react';
import PropTypes from 'prop-types';

import moment from 'moment-timezone';

import DayEvents from './DayEvents';
import { Event } from '../events/Event';
import { modes } from './MainCalendar';
import { SET_MIN } from '../actions/clipboard';
import Day from '../../components/Day';

/**
 * The component for displaying the schedule for a single day in the day view
 */
class DayController extends Component {
    /**
     * day: the day to be displayed
     * events: a list of all events, can be empty
     * mode: the toolbar mode it is currently in
     * moveEvent: handler for when drag drops happen
     * changeStart: handler to change the start of the event for resize
     * changeEnd: handler to change the end of the event for resize
     * cut: handler to cut an event
     * copy: handler to copy an event
     * paste: handler to paste an event
     * onlyHours: display only the hours and nothing else, used for week view
     * notifyDrag: handler to notify the week view when an event is being dragged
     * draggingEvent: an object which tells the day about what event is being dragged,
     *     used in week view
     *   event: the event being dragged
     *   selected: whether this day it the one dragging it
     */
    static propTypes = {
        day: PropTypes.instanceOf(moment).isRequired,
        events: PropTypes.arrayOf(PropTypes.instanceOf(Event)).isRequired,
        mode: PropTypes.number.isRequired,
        moveEvent: PropTypes.func.isRequired,
        changeStart: PropTypes.func.isRequired,
        changeEnd: PropTypes.func.isRequired,
        cut: PropTypes.func.isRequired,
        copy: PropTypes.func.isRequired,
        paste: PropTypes.func.isRequired,
        onlyHours: PropTypes.bool,
        notifyDrag: PropTypes.func,
        draggingEvent: PropTypes.shape({
            initialPos: PropTypes.number,
            event: PropTypes.instanceOf(Event),
            selected: PropTypes.bool,
            diff: PropTypes.number,
        }),
    }

    static defaultProps = {
        onlyHours: false,
        notifyDrag: () => {},
        draggingEvent: {
            initialPos: 0,
            event: null,
            selected: true,
            diff: 0,
        },
    }

    // in the case that the user is no longer dragging within the day
    static getDerivedStateFromProps(props, state) {
        const newState = { ...state };
        const { mode, draggingEvent } = props;
        if (mode === modes.DRAG_DROP && draggingEvent.selected === false) {
            newState.selectedEvent = null;
            newState.initialPos = 0;
            newState.mouseMove = 0;
            newState.startSelected = false;
        }
        return newState;
    }

    /**
     * Helper function to generate all the hours in the day
     * @param {day} the day to be displayed
     * Returns an array of objects with the hours and unix timestamps
     */
    static generateHours(day) {
        const hours = [];
        const current = day.clone().startOf('day');
        const end = day.clone().add(1, 'day').startOf('day');

        while (end.diff(current, 'hours') > 0) {
            // push the time in hours and the unix timestamp
            hours.push({
                hour: current.hour(),
                unix: current.unix(),
            });
            current.add(1, 'hour');
        }
        return hours;
    }

    /**
     * selectedEvent: the event being modified drag/drop or resize
     * initialPos: the initial position that the user started dragging
     * mouseMove: the amount the user has moved from initialPos
     * startSelected: during resize, whether the user clicked the start
     *     (false if they clicked the end)
     */
    state = {
        selectedEvent: null,
        initialPos: 0,
        mouseMove: 0,
        startSelected: false,
    }

    /**
     * Returns a handler for clicking on an event in copy/cut mode
     * @param {event} the event the handler is for
     */
    clipboardClosure = event => () => {
        const { cut, copy, mode } = this.props;
        if (mode === modes.CUT) {
            cut(event.id);
        } else if (mode === modes.COPY) {
            copy(event.id);
        }
    };

    /**
     * handler for when the user pastes an event in paste mode
     */
    onPasteClosure = (pxToHours, getYPos) => (...args) => {
        const { paste, mode, day } = this.props;
        if (mode !== modes.PASTE) {
            return;
        }
        // gets the y position relative to the start of the day
        const pos = getYPos(...args);
        // gets the current day
        const time = day.clone();
        // sets hours, pos/em converts it to em, each hour takes up 3 em
        // so dividing by 3 gives the offset in hours
        time.hour(Math.floor(pxToHours(pos)));
        // sets minutes, converts to hours, then multiply by 60 to get total minutes
        // then mod 60 to get the minutes within the hour.
        time.minute(Math.floor((pxToHours(pos) * 60) % 60));

        // paste an event at the new time (using minute granularity with SET_MIN)
        paste(time, SET_MIN);
    }

    /**
     * returns a handler for resize events
     * selectedEvent is the event being resized
     * sets startSelected to whatever is passed in
     */
    mouseDownClosureResize = getYPos => (event, startSelected) => (...args) => {
        this.setState({ selectedEvent: event, initialPos: getYPos(...args), startSelected });
    };

    /**
     * returns a handler for drag events
     * selectedEvent is the event being dragged
     */
    mouseDownClosureDrag = (getYPos, finish) => event => (...args) => {
        const { mode, notifyDrag } = this.props;
        if (mode !== modes.DRAG_DROP) {
            return;
        }
        notifyDrag(event, getYPos(...args));
        this.setState({ selectedEvent: event, initialPos: getYPos(...args) });
        finish(...args);
    };

    /**
     * mouse move event handler
     * sets the mouseMove state to the correct value
     */
    mouseMoveClose = (getYPos, finish) => (...args) => {
        const { notifyDrag, mode } = this.props;
        const { selectedEvent, initialPos } = this.state;

        // no event is currently being manipulated
        if (selectedEvent == null) {
            // if we are in drag and drop mode, notify our parent in case
            // an event is being dragged from another day
            if (mode === modes.DRAG_DROP) {
                notifyDrag((selectedEvent, initialPos) => {
                    // update our state with the dragged in event
                    this.setState({
                        selectedEvent,
                        initialPos,
                        mouseMove: getYPos(...args) - initialPos,
                    });
                });
            }
            return;
        }

        this.setState({ mouseMove: getYPos(...args) - initialPos });
        finish(...args);
    }

    /**
     * mouse Up event handler
     * calls the correct handler for resizing or drag/dropping an event
     */
    mouseUpClose = (pxToHours, finish) => (...args) => {
        const { selectedEvent, mouseMove, startSelected } = this.state;
        const {
            moveEvent,
            changeStart,
            changeEnd,
            mode,
            notifyDrag,
            draggingEvent,
        } = this.props;
        // the user isn't dragging or resizing an event
        if (selectedEvent == null) {
            return;
        }
        // notify the parent that the event has been dropped
        notifyDrag(false);
        // reset state to normal
        this.setState({
            selectedEvent: null,
            initialPos: 0,
            mouseMove: 0,
            startSelected: false,
        });
        // figure out the time difference based on how far the user moved their mouse
        // converts to hours then multiplies by 60 to get minutes
        const timeDiff = Math.round(pxToHours(mouseMove) * 60);
        if (mode === modes.DRAG_DROP) {
            // move the event some number of minutes based on mouse move
            moveEvent(selectedEvent.id, draggingEvent.diff, 'days');
            moveEvent(selectedEvent.id, timeDiff, 'minutes');
        } else if (mode === modes.RESIZE) {
            if (startSelected) {
                // change the start time based on how the user resized the event
                const startTime = selectedEvent.startTime.clone().add(timeDiff, 'minutes');
                changeStart(selectedEvent.id, startTime);
            } else {
                // change the end time based on how the user resized the event
                const endTime = selectedEvent.endTime.clone().add(timeDiff, 'minutes');
                changeEnd(selectedEvent.id, endTime);
            }
        }
        finish(...args);
    }

    render() {
        // see state definition
        const { selectedEvent, mouseMove, startSelected } = this.state;
        // see propTypes
        const {
            day,
            events,
            mode,
            onlyHours,
            draggingEvent,
        } = this.props;

        return (
            <Day
                tool={mode === modes.DRAG_DROP || mode === modes.CUT || mode === modes.COPY}
                pasting={mode === modes.PASTE}
                resizing={mode === modes.RESIZE}
                startSelected={startSelected}
                selectedEvent={selectedEvent}
                mouseMove={mouseMove}
                day={day}
                events={events}
                mouseUpClose={this.mouseUpClose}
                mouseMoveClose={this.mouseMoveClose}
                dragClose={this.mouseDownClosureDrag}
                resizeClose={this.mouseDownClosureResize}
                clipClose={this.clipboardClosure}
                pasteClose={this.onPasteClosure}
                DayEvents={DayEvents}
                hours={DayController.generateHours(day)}
                onlyHours={onlyHours}
                draggingEvent={draggingEvent}
            />
        );
    }
}

export default DayController;
