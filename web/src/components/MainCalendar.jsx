import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import moment from 'moment-timezone';

import '../styles/MainCalendar.css';
import { Event } from '../events/Event';
import { moveEvent } from '../actions/changeEvent';

import CalHeader from './CalHeader';
import Toolbar from './Toolbar';
import Month from './Month';
import Week from './Week';
import Day from './Day';

const modes = {
    NORMAL: 0,
    DRAG_DROP: 1,
};

// the types of calendars that can be displayed
const types = {
    MONTH: 0,
    WEEK: 1,
    DAY: 2,
};
const typesToString = ['month', 'week', 'day'];

/**
 * Main component for diplaying the calendar
 * Calendar can be a month, week, or day calendar depending on its state
 */
class MainCalendar extends Component {
    // when the user is scrolling, this represents the position that the user started scrolling from
    startPos = 0;

    /**
     * events: An array of events passed in by redux: state.events.events
     * navNewEvent: A handler for navigating to the new event form, gets passed in by the
     *     App component
     */
    static propTypes = {
        events: PropTypes.objectOf(PropTypes.instanceOf(Event)).isRequired,
        navNewEvent: PropTypes.func.isRequired,
        moveEvent: PropTypes.func.isRequired,
    };

    /**
     * date: the current date being displayed by the calendar, defaults to the current date
     * type: the type of calendar to display, defaults to month, see types
     * pos: the current scroll position of the calendar
     */
    state = {
        date: moment().tz(moment.tz.guess()),
        type: types.MONTH,
        pos: 0,
        mode: 0,
    };

    /**
     * handler for when the header's left navigation is triggered
     * sets the calendar back one date unit depending on the type the calendar is currently set to
     * i.e. if the calendar is in week mode, it changes the date to 1 week prior to the current date
     */
    onLeft = () => {
        const { date, type } = this.state;
        this.setState({ date: date.clone().subtract(1, typesToString[type]) });
    }

    /**
     * handler for when the header's right navigation is triggered
     * sets the calendar ahead one date unit depending on the type the calendar is currently set to
     * i.e. if the calendar is in week mode, it changes the date to 1 week after the current date
     */
    onRight = () => {
        const { date, type } = this.state;
        this.setState({ date: date.clone().add(1, typesToString[type]) });
    }

    /**
     * handler for when the header's switch event is triggered
     * cycles through the types of calendar (i.e. month, week, day)
     */
    onSwitch = () => {
        const { type } = this.state;
        this.setState({ type: (type + 1) % typesToString.length });
    }

    /**
     * begin touch
     * sets the start position to the current position the user is touching
     */
    beginScroll = (e) => {
        this.startPos = e.touches[0].pageY;
    }

    /**
     * touch change handler
     * sets the position to scroll the page depending on where the user moves their finger
     */
    scroll = (e) => {
        this.setState({ pos: e.touches[0].pageY - this.startPos });
    }

    /**
     * touch end handler
     * currently just sets the scroll position back to normal, not fully implemented
     */
    endScroll = () => {
        this.setState({ pos: 0 });
    }

    /**
     * switch to the passed in mode
     */
    toggleMode = (newMode) => {
        const { mode } = this.state;
        if (newMode === mode) {
            this.setState({ mode: modes.NORMAL });
        } else {
            this.setState({ mode: newMode });
        }
    }

    /**
     * main render method
     */
    render() {
        // see state
        const {
            mode, date,
            pos, type,
        } = this.state;
        // see propTypes
        const { navNewEvent, moveEvent } = this.props;
        let { events } = this.props;
        events = Object.values(events);
        // primary calendar component depending on the type of calendar
        let calElem;

        // selects the calendar component to display depending on the type of calendar
        //     being displayed
        switch (type) {
        case types.DAY:
            calElem = <Day mode={mode} moveEvent={moveEvent} events={events} day={date} />;
            break;
        case types.WEEK:
            calElem = <Week mode={mode} moveEvent={moveEvent} events={events} week={date} />;
            break;
        default:
        case types.MONTH:
            calElem = (
                <div className="calendarSlider" style={{ display: 'block' }}>
                    <div
                        className="slideContainer"
                        onTouchStart={this.beginScroll}
                        onTouchMove={this.scroll}
                        onTouchEnd={this.endScroll}
                        onTouchCancel={this.endScroll}
                    >
                        <div className="calContainer" style={{ top: `${pos}px` }}>
                            <Month
                                mode={mode}
                                moveEvent={moveEvent}
                                events={events}
                                id={date.month()}
                                month={date}
                            />
                        </div>
                    </div>
                </div>
            );
        }

        // Display the calendar with a CalHeader component at the top,
        //     followed by a Toolbar element,
        //     followed by the correct main calendar element
        return (
            <div className="calHome">
                <CalHeader
                    type={type}
                    date={date}
                    onLeft={this.onLeft}
                    onRight={this.onRight}
                    onSwitch={this.onSwitch}
                />
                <Toolbar
                    currMode={mode}
                    calType={type}
                    toggleMode={this.toggleMode}
                    navNewEvent={navNewEvent}
                />
                {calElem}
            </div>
        );
    }
}

// maps the redux store state.events.events to the events prop
const mapStateToProps = state => (
    {
        events: state.events.events,
    }
);

export default connect(mapStateToProps, { moveEvent })(MainCalendar);
export { modes, types };
