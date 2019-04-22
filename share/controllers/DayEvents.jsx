import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';

import { Event, RecurringEvent } from '../events/Event';
// eslint-disable-next-line no-unused-vars
import Frequency from '../events/Frequency';
import DayEvents from '../../components/DayEvents';
import DayEvent from '../../components/DayEvent';
import DragEv from '../../components/DragEv';

// eslint-disable-next-line no-unused-vars
function getUpdatedTime(time, reference, frequency) {
    const newTime = time.clone();
    return newTime.add(reference.clone().diff(time.clone().startOf('day'), 'days'), 'days');
}

// eslint-disable-next-line react/prefer-stateless-function
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
     * draggingEvent: info about whether there is an event being dragged
     *     and whether this day controls it, see Day class
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
        draggingEvent: PropTypes.shape({
            initialPos: PropTypes.number,
            event: PropTypes.instanceOf(Event),
            selected: PropTypes.bool,
            diff: PropTypes.number,
        }).isRequired,
    }

    static defaultProps = {
        selectedEvent: null,
    }

    generateEventHTML(event, virtualStart, virtualEnd, dayStart) {
        const {
            resizing,
            selectedEvent,
            startSelected,
            mouseMove,
            mouseDownClosureDrag,
            mouseDownClosureResize,
            clipboardClosure,
            pxToHours,
            draggingEvent,
        } = this.props;

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

        return eventHTML;
    }

    render() {
        const {
            day,
            events,
        } = this.props;

        // start and end of the day
        const dayStart = day.clone().startOf('day');
        const dayEnd = day.clone().endOf('day');

        // filters out all events that aren't in that day
        const dayEv = new Event(null, null, dayStart, dayEnd);
        const currEvents = events.filter(event => event.overlap(dayEv));

        const nextDay = dayEv.clone();
        nextDay.startTime.add(1, 'day');
        nextDay.endTime.add(1, 'day');

        const prevDay = dayEv.clone();
        prevDay.startTime.subtract(1, 'day');
        prevDay.endTime.subtract(1, 'day');

        const htmlEvents = [];

        currEvents.forEach((event) => { // add each event to the calendar
            // start and end of the event, but cut off if the event spans
            //     into the next or previous day

            let virtualStart = moment.max(event.startTime, dayStart);
            let virtualEnd = moment.min(event.endTime, dayEnd);

            if (event instanceof RecurringEvent) {
                virtualStart = dayStart;
                virtualEnd = getUpdatedTime(
                    event.endTime,
                    dayStart,
                    event.frequency.timing,
                );

                console.log(event.inRangeOfEvent(virtualEnd));
                console.log(event.inRangeOfEvent(virtualStart));

                if (event.endTime.isBefore(dayEnd)
                        && event.inRangeOfEvent(virtualStart)
                        && event.isMultiDay()) {
                    htmlEvents.push(this.generateEventHTML(
                        event.clone(),
                        virtualStart.clone(),
                        virtualEnd.clone(),
                        dayStart.clone(),
                    ));
                }

                if (!event.inRangeOfNonEndDays(dayStart)) {
                    virtualStart = moment.max(getUpdatedTime(
                        event.startTime,
                        dayStart,
                        event.frequency.timing,
                    ), dayStart);
                } else {
                    virtualStart = dayStart;
                }

                if (!event.isMultiDay() && !event.inRangeOfNonEndDays(dayEnd)) {
                    virtualEnd = moment.min(getUpdatedTime(
                        event.endTime,
                        dayStart,
                        event.frequency.timing,
                    ), dayEnd);
                } else {
                    virtualEnd = dayEnd;
                }

                if (!event.isMultiDay() || event.overlap(nextDay)) {
                    // returns a correctly positioned div representing an event
                    // The events get positioned overtop of calHours
                    htmlEvents.push(this.generateEventHTML(
                        event.clone(),
                        virtualStart.clone(),
                        virtualEnd.clone(),
                        dayStart.clone(),
                    ));
                }
            } else {
                // returns a correctly positioned div representing an event
                // The events get positioned overtop of calHours
                htmlEvents.push(this.generateEventHTML(
                    event.clone(),
                    virtualStart.clone(),
                    virtualEnd.clone(),
                    dayStart.clone(),
                ));
            }
        });

        return (
            <DayEvents>
                {htmlEvents}
            </DayEvents>
        );
    }
}

export default DayEventsController;
