import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import { connect } from 'react-redux';

import { Event, RecurringEvent } from '../events/Event';
// eslint-disable-next-line no-unused-vars
import Frequency from '../events/Frequency';
import DayEvents from '../../components/DayEvents';
import DayEvent from '../../components/DayEvent';
import DragEv from '../../components/DragEv';

/**
 * Update the time to be with respect to the reference
 * @param {*} time the time to update
 * @param {*} reference the reference for the new time
 * @param {*} frequency the frequency at which the event occurs
 */
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
     * snapToGrid: the snap to grid amount.
     * navEditEvent: navigate to editing an event
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
        }),
        snapToGrid: PropTypes.number.isRequired,
        navEditEvent: PropTypes.func.isRequired,
    }

    static defaultProps = {
        selectedEvent: null,
        draggingEvent: {
            initialPos: 0,
            event: null,
            selected: true,
            diff: 0,
        },
    }

    /**
     * turn a start and end time in a given day into an HTML format to display on the calendar
     *
     * Note that this function also handles the HTML for the event being selected by the user.
     *
     * @param {Event} event the event object being displayed
     * @param {moment} virtualStart the start time to display on the calendar
     * @param {moment} virtualEnd the end time to display on the calendar
     * @param {moment} dayStart the start of the day that the event will be added to
     */
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
            snapToGrid,
            navEditEvent,
        } = this.props;

        // convert to hours, for positioning of the element
        let startPos = virtualStart.diff(dayStart, 'minutes') / 60;
        let length = virtualEnd.diff(virtualStart, 'minutes') / 60;

        // if the event is being modified by the user with drag/drop or resize
        if (selectedEvent && selectedEvent.id === event.id) {
            let diff;
            if (!resizing || startSelected) {
                // move the start to the correct position
                startPos += pxToHours(mouseMove);
                diff = Math.round(startPos * 60 / snapToGrid)
                    / 60 * snapToGrid - startPos;
                startPos += diff;
            }
            // If the event is being resized
            if (resizing) {
                if (startSelected) {
                    length -= diff;
                    length -= pxToHours(mouseMove);
                } else {
                    length += pxToHours(mouseMove);
                    diff = Math.round((startPos + length) * 60 / snapToGrid)
                        / 60 * snapToGrid - startPos - length;
                    length += diff;
                }
            }
        }

        // create an event handler for drag start events for this event
        const mouseDown = mouseDownClosureDrag(event);

        // the html to add for the event
        const eventHTML = [
            <DayEvent
                navEditEvent={navEditEvent}
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
            draggingEvent,
            selectedEvent,
        } = this.props;

        // start and end of the day
        const dayStart = day.clone().startOf('day');
        const dayEnd = day.clone().endOf('day');

        // filters out all events that aren't in that day
        const dayEv = new Event(null, null, dayStart, dayEnd);
        const currEvents = events.filter((event) => {
            // the current day has focus, so we display all events for the day
            // plus any events currently being dragged
            if (draggingEvent.selected) {
                if (draggingEvent.event && draggingEvent.event.id === event.id) {
                    return true;
                }
            }
            // otherwise, if the event is during the day and not the one being moved
            if (event.overlap(dayEv)
                && (!draggingEvent.event || draggingEvent.event.id !== event.id)) {
                return true;
            }
            // if none of those statements are true, return false
            return false;
        });

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
            let virtualStart = event.startTime;
            let virtualEnd = event.endTime;
            if (selectedEvent && event.id === selectedEvent.id) {
                virtualStart = virtualStart.clone().add(draggingEvent.diff, 'days');
                virtualEnd = virtualEnd.clone().add(draggingEvent.diff, 'days');
            }

            virtualStart = moment.max(virtualStart, dayStart);
            virtualEnd = moment.min(virtualEnd, dayEnd);

            // if we are looking at a recurring event
            if (event instanceof RecurringEvent) {
                // determine the time that would be from the beginning of the day to the end time
                // this is necessary for when the event overlaps multiple days
                virtualStart = dayStart;
                virtualEnd = getUpdatedTime(
                    event.endTime,
                    dayStart,
                    event.frequency.timing,
                );

                // if the endtime is before the end of the day
                //    (to stop this event from showing up before it actually starts)
                // and the start of the current day is in the range of the event
                // and the recurring event is multiple days - if its not, then we don't
                //    need to show anything that starts at the beginning of the day
                if (event.endTime.isBefore(dayEnd)
                        && event.inRangeOfEvent(virtualStart)
                        && event.isMultiDay()) {
                    // add the calculated start and end times to the array to display
                    htmlEvents.push(this.generateEventHTML(
                        event,
                        virtualStart.clone(),
                        virtualEnd.clone(),
                        dayStart.clone(),
                    ));
                }

                // if the start of the day is not on the same day as an endtime of an iteration
                // of a recurring event, calculate the updated start of the event with repect to
                // the current day
                if (!event.inRangeOfNonEndDays(dayStart)) {
                    virtualStart = moment.max(getUpdatedTime(
                        event.startTime,
                        dayStart,
                        event.frequency.timing,
                    ), dayStart);
                // otherwise we just use the start of the day because the event should
                // span the whole day
                } else {
                    virtualStart = dayStart;
                }

                // if the event does not overlap multiple days and it is not on the same day as an
                // endpoint of an iteration of the recurring event, calculate the end time
                // with respect to the current day
                if (!event.isMultiDay() && !event.inRangeOfNonEndDays(dayEnd)) {
                    virtualEnd = moment.min(getUpdatedTime(
                        event.endTime,
                        dayStart,
                        event.frequency.timing,
                    ), dayEnd);
                // otherwise, we jsut use the end of the day because the event should
                // span the whole day
                } else {
                    virtualEnd = dayEnd;
                }

                // if the event is not multiday or it overlaps the next day, then push the event
                // to the array to display.
                // this is necessary to check because if the event is multiday and it does not
                // overlap with the next day, then the above push should be the last one for this
                // iteration of the recurring event
                if (!event.isMultiDay() || event.overlap(nextDay)) {
                    // returns a correctly positioned div representing an event
                    // The events get positioned overtop of calHours
                    htmlEvents.push(this.generateEventHTML(
                        event,
                        virtualStart.clone(),
                        virtualEnd.clone(),
                        dayStart.clone(),
                    ));
                }
            // if not a recurring event
            } else {
                // returns a correctly positioned div representing an event
                // The events get positioned overtop of calHours
                htmlEvents.push(this.generateEventHTML(
                    event,
                    virtualStart.clone(),
                    virtualEnd.clone(),
                    dayStart.clone(),
                ));
            }
        });

        // add the event html events to the calendar
        return (
            <DayEvents>
                {htmlEvents}
            </DayEvents>
        );
    }
}

const mapStateToProps = state => (
    {
        snapToGrid: state.settings.settings.snapToGrid,
    }
);

export default connect(mapStateToProps)(DayEventsController);
