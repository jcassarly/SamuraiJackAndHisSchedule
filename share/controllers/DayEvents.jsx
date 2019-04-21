import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';

import { Event } from '../events/Event';
import DayEvents from '../../components/DayEvents';
import DayEvent from '../../components/DayEvent';
import DragEv from '../../components/DragEv';

class DayEventsController extends Component {
    /**
     * day: the day to be displayed
     * events: a list of events to display, can be empty
     * resizing: whether the user is currently resizing their events
     * selectedEvent: whether the user has currently selected an event
     * startSelected: whether the user is currently dragging the start of the event
     * mouseMove: how far the mouse has moved
     * onMouseDown: a handler for mouse up events
     * clipboardClosure: a method for generating clipboard event handlers
     * pxToHours: a method which converts from pixels to hours
     */
    static propTypes = {
        day: PropTypes.instanceOf(moment).isRequired,
        events: PropTypes.arrayOf(PropTypes.instanceOf(Event)).isRequired,
        resizing: PropTypes.bool.isRequired,
        selectedEvent: PropTypes.instanceOf(Event),
        startSelected: PropTypes.bool.isRequired,
        mouseMove: PropTypes.number.isRequired,
        mouseDownClosureDrag: PropTypes.func.isRequired,
        mouseDownClosureResize: PropTypes.func.isRequired,
        clipboardClosure: PropTypes.func.isRequired,
        pxToHours: PropTypes.func.isRequired,
    }

    static defaultProps = {
        selectedEvent: null,
    }

    render() {
        const {
            day,
            events,
            resizing,
            selectedEvent,
            startSelected,
            mouseMove,
            mouseDownClosureDrag,
            mouseDownClosureResize,
            clipboardClosure,
            pxToHours,
        } = this.props;

        // start and end of the day
        const dayStart = day.clone().startOf('day');
        const dayEnd = day.clone().endOf('day');

        // filters out all events that aren't in that day
        const dayEv = new Event(null, null, dayStart, dayEnd);
        const currEvents = events.filter(event => Event.overlap(dayEv, event));

        return (
            <DayEvents>
                {currEvents.map((event) => { // add each event to the calendar
                    // start and end of the event, but cut off if the event spans
                    //     into the next or previous day
                    const virtualStart = moment.max(moment(event.startTime), dayStart);
                    const virtualEnd = moment.min(moment(event.endTime), dayEnd);

                    // convert to hours, for positioning of the element
                    let startPos = virtualStart.diff(dayStart, 'minutes') / 60;
                    let length = virtualEnd.diff(virtualStart, 'minutes') / 60;

                    // if the event is being modified by the user with drag/drop or resize
                    if (selectedEvent && selectedEvent.id === event.id) {
                        if (!resizing || startSelected) {
                            // move the start to the correct position
                            startPos += pxToHours(mouseMove);
                        }
                        // If the event is being resized
                        if (resizing) {
                            // move the end to the correct position
                            if (startSelected) {
                                length -= pxToHours(mouseMove);
                            } else {
                                length += pxToHours(mouseMove);
                            }
                        }
                    }

                    // create an event handler for drag start events for this event
                    const mouseDown = mouseDownClosureDrag(event);

                    // the html to add for the event
                    const eventHTML = [
                        <DayEvent
                            key={event.id}
                            startHours={startPos}
                            length={length}
                            onMouseDown={mouseDown}
                            onClip={clipboardClosure(event)}
                            event={event}
                        />,
                    ];

                    // add extra divs to catch attempts to resize
                    if (resizing) {
                        // create a handler for when the user starts dragging
                        // the start of the event
                        const mouseDownStart = mouseDownClosureResize(event, true);
                        // create a handler for when the user starts dragging
                        // the end of the event
                        const mouseDownEnd = mouseDownClosureResize(event, false);
                        // add an element positioned right at the start of the event
                        // the element is 1em, so it positions the start of the event
                        // directly in the center of the element
                        eventHTML.unshift(<DragEv
                            key={`${event.id}_start`}
                            pos={startPos}
                            onMouseDown={mouseDownStart}
                        />);
                        // add an element positioned right at the end of the event
                        // the element is 1em, so it positions the end of the event
                        // directly in the center of the element
                        eventHTML.push(<DragEv
                            key={`${event.id}_end`}
                            pos={startPos + length}
                            onMouseDown={mouseDownEnd}
                        />);
                    }

                    // returns a correctly positioned div representing an event
                    // The events get positioned overtop of calHours
                    return eventHTML;
                })}
            </DayEvents>
        );
    }
}

export default DayEventsController;