import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';

import { Event, RecurringEvent } from '../events/Event';
import Frequency from '../events/Frequency';
import DayEvents from '../../components/DayEvents';
import DayEvent from '../../components/DayEvent';
import DragEv from '../../components/DragEv';

function getUpdatedTime(time, reference, frequency) {
    const newTime = time.clone();
    switch (frequency) {
    case Frequency.freqEnum.DAILY:
        return newTime.add(reference.diff(time.clone().startOf('day'), 'days'), 'days');
    case Frequency.freqEnum.WEEKLY:
        return newTime.add(reference.diff(time.clone().startOf('day'), 'days'), 'days');
    case Frequency.freqEnum.MONTHLY: {
        // note that this overlap has some odd behaviors when events start
        // and end in different months.  Not sure what the correct behavoir is
        // so this issue is being overlooked right now
        return null;
    }
    case Frequency.freqEnum.YEARLY:
        return null;
    default:
        throw new Error('not a valid frequency');
    }
}

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
        const currEvents = events.filter(event => event.overlap(dayEv));

        return (
            <DayEvents>
                {currEvents.map((event) => { // add each event to the calendar
                    // start and end of the event, but cut off if the event spans
                    //     into the next or previous day
                    let virtualStart = moment.max(event.startTime, dayStart);
                    let virtualEnd = moment.min(event.endTime, dayEnd);

                    if (event instanceof RecurringEvent) {
                        console.log('-----');
                        console.log(getUpdatedTime(
                            event.startTime,
                            dayStart,
                            event.frequency.timing,
                        ));
                        virtualStart = moment.max(getUpdatedTime(
                            event.startTime,
                            dayStart,
                            event.frequency.timing,
                        ), dayStart);

                        console.log(virtualStart);

                        virtualEnd = moment.min(getUpdatedTime(
                            event.endTime,
                            dayEnd,
                            event.frequency.timing,
                        ), dayEnd);
                    }

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
