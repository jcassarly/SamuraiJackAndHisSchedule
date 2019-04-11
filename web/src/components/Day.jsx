import React, { Component } from 'react';
import PropTypes from 'prop-types';

import moment from 'moment-timezone';

import { Event } from '../events/Event';
import { modes } from './MainCalendar';
import { SET_MIN } from '../actions/clipboard';
import em from '../em2px';
import '../styles/Day.css';

/**
 * The component for displaying the schedule for a single day in the day view
 */
class Day extends Component {
    /**
     * day: the day to be displayed
     * events: a list of events to display, can be empty
     * mode: the toolbar mode it is currently in
     * moveEvent: handler for when drag drops happen
     * changeStart: handler to change the start of the event for resize
     * changeEnd: handler to change the end of the event for resize
     * cut: handler to cut an event
     * copy: handler to copy an event
     * paste: handler to paste an event
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
    }


    /**
     * Helper function to generate all the div elements corresponding to each hour
     * @param {day} the day to be displayed
     * Returns an array of div elements for each hour
     */
    static generateHours(day) {
        const hours = [];
        const current = day.clone().startOf('day');
        const end = day.clone().add(1, 'day').startOf('day');

        while (end.diff(current, 'hours') > 0) {
            // div for displaying the actual hour number
            hours.push((
                <div key={`l-${current.unix()}`} className="hour">
                    {current.hour()}
                </div>
            ));
            // div for displaying the hour blocks
            hours.push(<div key={current.unix()} className="evHour" />);

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

    /**
     * Returns a handler for clicking on an event in cop/cut mode
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
    onPaste = (e) => {
        const { paste, mode, day } = this.props;
        if (mode !== modes.PASTE) {
            return;
        }
        // gets the y position relative to the calHours element
        const pos = Day.getYPos(e) - e.currentTarget.getBoundingClientRect().top;
        // gets the current day
        const time = day.clone();
        // sets hours, pos/em converts it to em, each hour takes up 3 em
        // so dividing by 3 gives the offset in hours
        time.hour(Math.floor(pos / em / 3), 'hours');
        // sets minutes, converts to hours, then multiply by 60 to get total minutes
        // then mod 60 to get the minutes within the hour.
        time.minute(Math.floor((pos / em / 3 * 60) % 60));

        // paste an event at the new time (using minute granularity with SET_MIN)
        paste(time, SET_MIN);
    }

    /**
     * returns a handler for resize events
     * selectedEvent is the event being resized
     * sets startSelected to whatever is passed in
     */
    mouseDownClosureResize = (event, startSelected) => (e) => {
        this.setState({ selectedEvent: event, initialPos: Day.getYPos(e), startSelected });
    };

    /**
     * returns a handler for drag events
     * selectedEvent is the event being dragged
     */
    mouseDownClosureDrag = event => (e) => {
        const { mode } = this.props;
        if (mode !== modes.DRAG_DROP) {
            return;
        }
        this.setState({ selectedEvent: event, initialPos: Day.getYPos(e) });
        e.preventDefault();
    };

    /**
     * mouse move event handler
     * sets the mouseMove state to the correct value
     */
    mouseMove = (e) => {
        const { selectedEvent, initialPos } = this.state;
        if (selectedEvent == null) {
            return;
        }
        this.setState({ mouseMove: Day.getYPos(e) - initialPos });
        e.preventDefault();
    }

    /**
     * mouse Up event handler
     * calls the correct handler for resizing or drag/dropping an event
     */
    mouseUp = (e) => {
        const { selectedEvent, mouseMove, startSelected } = this.state;
        const {
            moveEvent,
            changeStart,
            changeEnd,
            mode,
        } = this.props;
        // the user isn't dragging or resizing an event
        if (selectedEvent == null) {
            return;
        }
        // reset state to normal
        this.setState({
            selectedEvent: null,
            initialPos: 0,
            mouseMove: 0,
            startSelected: false,
        });
        // figure out the time difference based on how far the user moved their mouse
        // divides by em to get in ems, then by 3 to get hours, then multiplies by 60 to get minutes
        const timeDiff = Math.round(mouseMove / em / 3 * 60);
        if (mode === modes.DRAG_DROP) {
            // move the event some number of minutes based on mouse move
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
        e.preventDefault();
    }

    render() {
        // see state definition
        const { selectedEvent, mouseMove, startSelected } = this.state;
        // see propTypes
        const {
            day,
            events,
            mode,
        } = this.props;

        // start and end of the day
        const dayStart = day.clone().startOf('day');
        const dayEnd = day.clone().endOf('day');

        // filters out all events that aren't in that day
        const dayEv = new Event(null, null, dayStart, dayEnd);
        const currEvents = events.filter(event => Event.overlap(dayEv, event));

        return (
            <div
                className={`calDay ${mode === modes.DRAG_DROP || mode === modes.CUT || mode === modes.COPY ? 'tool' : ''} ${mode === modes.PASTE ? 'paste' : ''}`}
                onMouseMove={this.mouseMove}
                onMouseUp={this.mouseUp}
                onTouchMove={this.mouseMove}
                onTouchEnd={this.mouseUp}
                onTouchCancel={this.mouseUp}
            >
                <div className="dayEvents">
                    {currEvents.map((event) => { // add each event to the calendar
                        // start and end of the event, but cut off if the event spans
                        //     into the next or previous day
                        const virtualStart = moment.max(moment(event.startTime), dayStart);
                        const virtualEnd = moment.min(moment(event.endTime), dayEnd);

                        // convert to hours, then ems for positioning of the element
                        let startPos = virtualStart.diff(dayStart, 'minutes') / 60 * 3;
                        let length = virtualEnd.diff(virtualStart, 'minutes') / 60 * 3;

                        // if the event is being modified by the user with drag/drop or resize
                        if (selectedEvent && selectedEvent.id === event.id) {
                            if (mode !== modes.RESIZE || startSelected) {
                                // move the start to the correct position
                                startPos += mouseMove / em;
                            }
                            // If the event is being resized
                            if (mode === modes.RESIZE) {
                                // move the end to the correct position
                                if (startSelected) {
                                    length -= mouseMove / em;
                                } else {
                                    length += mouseMove / em;
                                }
                            }
                        }

                        // create an event handler for drag start events for this event
                        const mouseDown = this.mouseDownClosureDrag(event);

                        // the html to add for the event
                        const eventHTML = [
                            <div
                                key={event.id}
                                style={{ top: `${startPos}em`, height: `${length}em` }}
                                onMouseDown={mouseDown}
                                onTouchStart={mouseDown}
                                onClick={this.clipboardClosure(event)}
                            >
                                {event.name}
                            </div>,
                        ];

                        // add extra divs to catch attempts to resize
                        if (mode === modes.RESIZE) {
                            // create a handler for when the user starts dragging
                            // the start of the event
                            const mouseDownStart = this.mouseDownClosureResize(event, true);
                            // create a handler for when the user starts dragging
                            // the end of the event
                            const mouseDownEnd = this.mouseDownClosureResize(event, false);
                            // add an element positioned right at the start of the event
                            // the element is 1em, so it positions the start of the event
                            // directly in the center of the element
                            eventHTML.unshift(<div
                                className="resize"
                                key={`${event.id}_start`}
                                style={{ top: `${startPos - 0.5}em` }}
                                onMouseDown={mouseDownStart}
                                onTouchStart={mouseDownStart}
                            />);
                            // add an element positioned right at the end of the event
                            // the element is 1em, so it positions the end of the event
                            // directly in the center of the element
                            eventHTML.push(<div
                                className="resize"
                                key={`${event.id}_end`}
                                style={{ top: `${startPos + length - 0.5}em` }}
                                onMouseDown={mouseDownEnd}
                                onTouchStart={mouseDownEnd}
                            />);
                        }

                        // returns a correctly positioned div representing an event
                        // The events get positioned overtop of calHours
                        return eventHTML;
                    })}
                </div>
                <div className="calHours" onClick={this.onPaste}>
                    { Day.generateHours(day) }
                </div>
            </div>
        );
    }
}

export default Day;
