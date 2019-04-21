import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import moment from 'moment-timezone';

import Week from '../../components/Week';
import Day from './Day';
import { Event } from '../events/Event';

const WEEK_LEN = 7;

/**
 * Component for displaying the calendar in Week view
 */
class WeekController extends Component {
    state = {
        initialFocus: -1,
        focused: -1,
        selectedEvent: null,
        initialPos: 0,
    }

    onDragClose = i => (arg1, pos) => {
        const { selectedEvent, initialPos } = this.state;
        // in the case that the user drops the current selection, we can stop caring about it
        if (arg1 === false) {
            this.setState({
                initialFocus: -1,
                focused: -1,
                selectedEvent: null,
                initialPos: 0,
            });

        // otherwise, if we are tracking an event,
        // a user must be dragging accross days
        } else if (_.isFunction(arg1) && selectedEvent) {
            this.setState({
                focused: i,
            });
            // let the day component know that it has recieved a new element
            arg1(selectedEvent, initialPos);

        // if there is a selected event passed in, then the user just picked up an event
        } else if (arg1 instanceof Event) {
            this.setState({
                selectedEvent: arg1,
                initialFocus: i,
                focused: i,
                initialPos: pos,
            });
        }
    }

    render() {
        const {
            week,
            events,
            mode,
            moveEvent,
            changeStart,
            changeEnd,
            cut,
            copy,
            paste,
        } = this.props;
        const {
            initialPos,
            selectedEvent,
            focused,
            initialFocus,
        } = this.state;
        const start = week.startOf('week');
        const unix = start.unix();

        return (
            <Week>
                {[...Array(WEEK_LEN + 1)].map((_, i) => {
                    const index = i - 1;
                    const notifyDrag = this.onDragClose(index);
                    return (
                        <Day
                            // eslint-disable-next-line react/no-array-index-key
                            key={`${unix}-${i}`}
                            day={index === -1 ? start : start.clone().add(index, 'day').startOf('day')}
                            events={events}
                            mode={mode}
                            moveEvent={moveEvent}
                            changeStart={changeStart}
                            changeEnd={changeEnd}
                            cut={cut}
                            copy={copy}
                            paste={paste}
                            onlyHours={index === -1}
                            notifyDrag={notifyDrag}
                            draggingEvent={{
                                initialPos,
                                event: selectedEvent,
                                selected: index !== -1 && index === focused,
                                diff: focused - initialFocus,
                            }}
                        />
                    );
                })}
            </Week>
        );
    }
}

/**
 * week: the week to display
 * events: a list of all events, can be empty
 * mode: the toolbar mode it is currently in
 * moveEvent: handler for when drag drops happen
 * changeStart: handler to change the start of the event for resize
 * changeEnd: handler to change the end of the event for resize
 * cut: handler to cut an event
 * copy: handler to copy an event
 * paste: handler to paste an event
 */
WeekController.propTypes = {
    week: PropTypes.instanceOf(moment).isRequired,
    events: PropTypes.arrayOf(PropTypes.instanceOf(Event)).isRequired,
    mode: PropTypes.number.isRequired,
    moveEvent: PropTypes.func.isRequired,
    changeStart: PropTypes.func.isRequired,
    changeEnd: PropTypes.func.isRequired,
    cut: PropTypes.func.isRequired,
    copy: PropTypes.func.isRequired,
    paste: PropTypes.func.isRequired,
};

export default WeekController;
