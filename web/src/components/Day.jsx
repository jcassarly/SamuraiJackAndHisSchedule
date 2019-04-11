import React, { Component } from 'react';
import PropTypes from 'prop-types';

import moment from 'moment-timezone';

import { Event } from '../events/Event';
import { modes } from './MainCalendar';
import em from '../em2px';
import '../styles/Day.css';

/**
 * The component for displaying the schedule for a single day in the day view
 */
class Day extends Component {
    /**
     * day: the day to be displayed
     * events: a list of events to display, can be empty
     */
    static propTypes = {
        day: PropTypes.instanceOf(moment).isRequired,
        events: PropTypes.arrayOf(PropTypes.instanceOf(Event)).isRequired,
        mode: PropTypes.number.isRequired,
        moveEvent: PropTypes.func.isRequired,
        changeStart: PropTypes.func.isRequired,
        changeEnd: PropTypes.func.isRequired,
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

    state = {
        selectedEvent: null,
        initialPos: 0,
        mouseMove: 0,
        startSelected: false,
    }

    static getYPos(e) {
        let yPos;
        if (e.touches) {
            yPos = e.touches[0].clientY;
        } else {
            yPos = e.clientY;
        }
        return yPos;
    }

    mouseDownClosureResize = (event, startSelected) => (e) => {
        this.setState({ selectedEvent: event, initialPos: Day.getYPos(e), startSelected });
    };

    mouseDownClosureDrag = event => (e) => {
        this.setState({ selectedEvent: event, initialPos: Day.getYPos(e) });
        e.preventDefault();
    };

    mouseMove = (e) => {
        const { selectedEvent, initialPos } = this.state;
        if (selectedEvent == null) {
            return;
        }
        this.setState({ mouseMove: Day.getYPos(e) - initialPos });
        e.preventDefault();
    }

    mouseUp = (e) => {
        const { selectedEvent, mouseMove, startSelected } = this.state;
        const {
            moveEvent,
            changeStart,
            changeEnd,
            mode,
        } = this.props;
        if (selectedEvent == null) {
            return;
        }
        this.setState({
            selectedEvent: null,
            initialPos: 0,
            mouseMove: 0,
            startSelected: false,
        });
        const timeDiff = Math.round(mouseMove / em / 3 * 60);
        if (mode === modes.DRAG_DROP) {
            // mouseMove is in pixels, so convert to em, divide by 3 to convert to hours,
            // then multiply by 60 to get minutes
            moveEvent(selectedEvent.id, timeDiff, 'minutes');
        } else if (mode === modes.RESIZE) {
            if (startSelected) {
                const startTime = selectedEvent.startTime.clone().add(timeDiff, 'minutes');
                changeStart(selectedEvent.id, startTime);
            } else {
                const endTime = selectedEvent.endTime.clone().add(timeDiff, 'minutes');
                changeEnd(selectedEvent.id, endTime);
            }
        }
        e.preventDefault();
    }

    render() {
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
                className={`calDay ${mode === modes.DRAG_DROP ? 'drag' : ''}`}
                onMouseMove={this.mouseMove}
                onMouseUp={this.mouseUp}
                onTouchMove={this.mouseMove}
                onTouchEnd={this.mouseUp}
                onTouchCancel={this.mouseUp}
            >
                <div className="dayEvents">
                    {currEvents.map((event, i) => { // add each event to the calendar
                        // start and end of the event, but cut off if the event spans
                        //     into the next or previous day
                        const virtualStart = moment.max(moment(event.startTime), dayStart);
                        const virtualEnd = moment.min(moment(event.endTime), dayEnd);

                        // convert to hours, then ems for positioning of the element
                        let startPos = virtualStart.diff(dayStart, 'minutes') / 60 * 3;
                        let length = virtualEnd.diff(virtualStart, 'minutes') / 60 * 3;

                        if (selectedEvent
                            && selectedEvent.id === event.id
                            && (mode !== modes.RESIZE || startSelected)) {
                            startPos += mouseMove / em;
                        }
                        if (mode === modes.RESIZE) {
                            if (startSelected) {
                                length -= mouseMove / em;
                            } else {
                                length += mouseMove / em;
                            }
                        }

                        let mouseDown = () => {};
                        if (mode === modes.DRAG_DROP) {
                            mouseDown = this.mouseDownClosureDrag(event);
                        }

                        const eventHTML = [
                            <div
                                key={event.id}
                                style={{ top: `${startPos}em`, height: `${length}em` }}
                                onMouseDown={mouseDown}
                                onTouchStart={mouseDown}
                            >
                                {event.name}
                            </div>,
                        ];

                        if (mode === modes.RESIZE) {
                            const mouseDownStart = this.mouseDownClosureResize(event, true);
                            const mouseDownEnd = this.mouseDownClosureResize(event, false);
                            eventHTML.unshift(<div
                                className="resize"
                                key={`${event.id}_start`}
                                style={{ top: `${startPos - 0.5}em` }}
                                onMouseDown={mouseDownStart}
                                onTouchStart={mouseDownStart}
                            />);
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
                <div className="calHours">
                    { Day.generateHours(day) }
                </div>
            </div>
        );
    }
}

export default Day;
