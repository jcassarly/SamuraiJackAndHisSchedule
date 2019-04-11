import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import moment from 'moment-timezone';

import '../styles/MainCalendar.css';
import { Event } from '../events/Event';

import CalHeader from './CalHeader';
import Toolbar from './Toolbar';
import Month from './Month';
import Week from './Week';
import Day from './Day';

/**
 * Main component for diplaying the calendar
 * Calendar can be a month, week, or day calendar depending on its state
 */
class MainCalendar extends Component {
    // when the user is scrolling, this represents the position that the user started scrolling from
    startPos = 0;

    // the types of calendars that can be displayed
    // does not change
    types = ['month', 'week', 'day'];

    /**
     * events: An array of events passed in by redux: state.events.events
     * navNewEvent: A handler for navigating to the new event form, gets passed in by the
     *     App component
     */
    static propTypes = {
        events: PropTypes.objectOf(PropTypes.instanceOf(Event)).isRequired,
        navNewEvent: PropTypes.func.isRequired,
        navSettings: PropTypes.func.isRequired,
    };

    /**
     * date: the current date being displayed by the calendar, defaults to the current date
     * type: the type of calendar to display, defaults to month, see types
     * pos: the current scroll position of the calendar
     */
    state = {
        date: moment().tz(moment.tz.guess()),
        type: this.types[0],
        pos: 0,
    };

    /**
     * handler for when the header's left navigation is triggered
     * sets the calendar back one date unit depending on the type the calendar is currently set to
     * i.e. if the calendar is in week mode, it changes the date to 1 week prior to the current date
     */
    onLeft = () => {
        const { date, type } = this.state;
        this.setState({ date: date.clone().subtract(1, type) });
    }

    /**
     * handler for when the header's right navigation is triggered
     * sets the calendar ahead one date unit depending on the type the calendar is currently set to
     * i.e. if the calendar is in week mode, it changes the date to 1 week after the current date
     */
    onRight = () => {
        const { date, type } = this.state;
        this.setState({ date: date.clone().add(1, type) });
    }

    /**
     * handler for when the header's switch event is triggered
     * cycles through the types of calendar (i.e. month, week, day)
     */
    onSwitch = () => {
        const { type } = this.state;
        this.setState({ type: this.types[(this.types.indexOf(type) + 1) % this.types.length] });
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
     * main render method
     */
    render() {
        // see state
        const { date, pos, type } = this.state;
        // see propTypes
        const { navNewEvent, navSettings } = this.props;
        let { events } = this.props;
        events = Object.values(events);
        // primary calendar component depending on the type of calendar
        let calElem;

        // selects the calendar component to display depending on the type of calendar
        //     being displayed
        switch (type) {
        case 'day':
            calElem = <Day events={events} day={date} />;
            break;
        case 'week':
            calElem = <Week events={events} week={date} />;
            break;
        default:
        case 'month':
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
                            <Month events={events} id={date.month()} month={date} />
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
                <Toolbar navNewEvent={navNewEvent} navSettings={navSettings} />
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

export default connect(mapStateToProps)(MainCalendar);
