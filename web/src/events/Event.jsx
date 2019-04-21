import Frequency from './Frequency';
import Notifications from './Notifications';
import { Deadline } from './Deadline';
import ColorEnum from '../components/ColorEnum';

const moment = require('moment-timezone');

moment().format();

const EVENT_TYPES = {
    EVENT: 'event',
    LOCATION: 'location',
    RECURRING: 'recurring',
};

const DAYS_IN_WEEK = 7;

/**
 * verifies that two times are compatible start and end times
 * @param {*} start start time to be evaluated
 * @param {*} end end time to be evaluated
 */
function verifyTimes(start, end) {
    if (!(start instanceof moment) && !(end instanceof moment)) {
        throw new Error('Invalid Start and End Time');
    } else if (!(start instanceof moment)) {
        throw new Error('Invalid Start Time');
    } else if (!(end instanceof moment)) {
        throw new Error('Invalid End Time');
    } else if (start.isAfter(end)) {
        throw new Error('Start time after end time');
    }
}

/**
 * Checks if value is in the inclusive range of [start, end]
 * @param {*} value the value to check if it is in range
 * @param {*} start the start of the range
 * @param {*} end the end of the range
 */
function inRange(value, start, end) {
    return (value >= start && value <= end);
}

/**
 * Checks if at least one of the values is in the inclusive range [start, end]
 * @param {*} value1 the first value to check if it is in range
 * @param {*} value2 the other value to check if it is in range
 * @param {*} start the start of the range
 * @param {*} end the end of the range
 */
function eitherInRange(value1, value2, start, end) {
    return (inRange(value1, start, end) || inRange(value2, start, end));
}

/**
 * Checks that neither of the values are in the inclusive range [start, end]
 * @param {*} value1 the first value to check if it is not in range
 * @param {*} value2 the other value to check if it is not in range
 * @param {*} start the start of the range
 * @param {*} end the end of the range
 */
function neitherInRange(value1, value2, start, end) {
    return !eitherInRange(value1, value2, start + 1, end - 1); // extend range to be exclusive
}

class Event {
    constructor(
        name,
        description,
        startTime,
        endTime,
        location,
        locked,
        notifications,
        parent,
        color,
    ) {
        this.name = name;
        this.description = description;

        verifyTimes(startTime, endTime);
        this._startTime = startTime.clone();
        this._endTime = endTime.clone();

        this.location = location;
        this.locked = locked;
        this.notifications = notifications;
        this.parent = parent;

        this.id = -1; // default is no ID - to be set later
        this.color = (color === null || color === undefined) ? ColorEnum.BLUE_BLACK : color;
    }

    // returns name
    get name() {
        return this._name;
    }

    // returns description
    get description() {
        return this._description;
    }

    // returns startTime
    get startTime() {
        return this._startTime;
    }

    // returns endTime
    get endTime() {
        return this._endTime;
    }

    // returns location
    get location() {
        return this._location;
    }

    // returns locked
    get locked() {
        return this._locked;
    }

    // returns notifications
    get notifications() {
        return this._notifications;
    }

    // returns parent, null if no parent
    get parent() {
        return this._parent;
    }

    /**
     * Returns the id of the event in the redux store. -1 if it has not been set yet
     */
    get id() {
        return this._id;
    }

    /**
     * Returns the color of the event
     */
    get color() {
        return this._color;
    }

    // sets the name to a string
    set name(value) {
        this._name = value;
    }

    // sets description to a string
    set description(value) {
        this._description = value;
    }

    // this takes a String as input
    set startTime(value) {
        verifyTimes(value, this._endTime);
        this._startTime = value;
    }

    // this takes a String as input
    set endTime(value) {
        verifyTimes(this._startTime, value);
        this._endTime = value;
    }

    // this sets location to a string
    set location(value) {
        this._location = value;
    }

    // this sets locked to a boolean
    set locked(value) {
        this._locked = value;
    }

    // this sets notifications to a notifications[]
    set notifications(value) {
        this._notifications = value;
    }

    // this sets parent to a Deadline
    set parent(value) {
        this._parent = value;
    }

    /**
     * Set the id of the Event in the redux store to value
     * @param {int} value the new id
     */
    set id(value) {
        this._id = value;
    }

    /**
     * Set the color of the event to the value
     */
    set color(value) {
        this._color = value;
    }

    /**
     * Checks if the start and end times of this event are in the same week
     */
    timesWithinAWeek() {
        return this.endTime.diff(this.startTime, 'days') < DAYS_IN_WEEK;
    }

    addNotification(timeBefore, type) {
        this._notifications.push(new Notifications(type, timeBefore, this._startTime));
    }

    removeNotification(notification) {
        const toRemove = this._notifications.findIndex(item => item.equals(notification));
        this._notifications.splice(toRemove);
    }

    /**
     * Returns a boolean value of true if the two events overlap, false otherwise
     * @param {*} event1 first event to check
     * @param {*} event2 second event to check
     */
    overlap(event2) {
        console.log('noop');
        if (this.startTime.isAfter(event2.startTime)
        && this.startTime.isBefore(event2.endTime)) {
            return true;
        } if (event2.startTime.isAfter(this.startTime)
        && event2.startTime.isBefore(this.endTime)) {
            return true;
        } if (this.endTime.isAfter(event2.startTime)
        && this.endTime.isBefore(event2.endTime)) {
            return true;
        } if (event2.endTime.isAfter(this.startTime)
        && event2.endTime.isBefore(this.endTime)) {
            return true;
        }
        return false;
    }

    clone() {
        return new Event(
            this.name,
            this.description,
            this.startTime,
            this.endTime,
            this.location,
            this.locked,
            this.notifications,
            this.parent,
            this.color,
        );
    }

    /**
     * Serialize this event object so it can be stored
     * returns a JSON string with the event object
     */
    serialize() {
        return {
            type: EVENT_TYPES.EVENT,
            obj: {
                id: this.id,
                name: this.name,
                description: this.description,
                startTime: this.startTime,
                endTime: this.endTime,
                location: this.location,
                locked: this.locked,
                notifications: this.notifications,
                color: this.color,
                // if the parent is not null, use the id, otherwise there is no id, so -1
                parent: (
                    this.parent !== null
                    && this.parent !== undefined
                    && this.parent instanceof Deadline
                ) ? this.parent.id : -1,
            },
        };
    }
}

// Class for events denoting only location which extends Event
class LocationEvent extends Event {
    constructor(name, description, startTime, endTime, notifications, color) {
        super(name, description, startTime, endTime, name, true, notifications, null, color);
    }

    clone() {
        return new LocationEvent(
            this.name,
            this.description,
            this.startTime,
            this.endTime,
            this.notifications,
            this.color,
        );
    }

    /**
     * Serialize this location event object so it can be stored
     * returns a JSON string with the location event object
     */
    serialize() {
        // all the serialization is the same as the event except that the type is location
        const retval = super.serialize();
        retval.type = EVENT_TYPES.LOCATION;

        return retval;
    }
}

// Class for recurring events
class RecurringEvent extends Event {
    constructor(name, description, startTime, endTime, location, locked,
        notifications, color, frequency, optionalCustomFrequency) {
        super(name, description, startTime, endTime, location, locked, notifications, null, color);
        this._frequency = new Frequency(this, frequency, optionalCustomFrequency);
    }

    // creates a new event that is a copy of this one
    clone() {
        return new RecurringEvent(
            this.name,
            this.description,
            this.startTime,
            this.endTime,
            this.location,
            this.locked,
            this.notifications,
            this.color,
            this.frequency.timing,
            this.frequency.customSettings,
        );
    }

    // returns frequency
    get frequency() {
        return this._frequency;
    }

    // sets frequency to a Frequency object
    set frequency(value) {
        this._frequency = value;
    }

    rangeOverlap(other, precisionType) {
        let retval = false;
        if (this.startTime.get(precisionType) > this.endTime.get(precisionType)) {
            retval = neitherInRange(
                other.startTime.get(precisionType),
                other.endTime.get(precisionType),
                this.endTime.get(precisionType),
                this.startTime.get(precisionType),
            );
        } else {
            retval = eitherInRange(
                other.startTime.get(precisionType),
                other.endTime.get(precisionType),
                this.startTime.get(precisionType),
                this.endTime.get(precisionType),
            );
        }

        return retval;
    }

    overlap(other) {
        const minOverlapTime = (other.endTime.isSameOrAfter(this.startTime.startOf('day')));

        switch (this.frequency.timing) {
        case Frequency.freqEnum.DAILY:
            return minOverlapTime;
        case Frequency.freqEnum.WEEKLY:
            return minOverlapTime && (this.rangeOverlap(other, 'day') || !this.timesWithinAWeek());
        case Frequency.freqEnum.MONTHLY: {
            // note that this overlap has some odd behaviors when events start
            // and end in different months.  Not sure what the correct behavoir is
            // so this issue is being overlooked right now
            return minOverlapTime && (this.rangeOverlap(other, 'date'));
        }
        case Frequency.freqEnum.YEARLY:
            return minOverlapTime && (this.rangeOverlap(other, 'dayOfYear'));
        default:
            throw new Error('not a valid frequency');
        }
    }

    /**
     * Serialize this recurring event object so it can be stored
     * returns a JSON string with the recurring event object
     */
    serialize() {
        const retval = super.serialize();

        // set the type of event for when deserialization happens
        retval.type = EVENT_TYPES.RECURRING;

        // add the frequency fields
        retval.obj = {
            ...retval.obj,
            frequency: this.frequency.timing,
            optionalCustomFrequency: this.frequency.customSettings,
        };
        return retval;
    }
}

/**
 * Deserializes a JSON string containing an event object
 * (should have the same form as the output of the serialize methods for its respective type)
 * @param {string} jsonStr a JSON string containing one Event or Event subclass
 * Returns an Event or subclass of event parsed from the jsonStr
 *
 * class is based on the type field
 */
function deserialize(jsonStr) {
    const json = JSON.parse(jsonStr);
    console.log(jsonStr);
    console.log(json);

    const { type, obj } = json;

    console.log(obj);
    console.log(obj.frequency);

    let newEvent = null;

    // check the type
    switch (type) {
    // type is normal event
    case EVENT_TYPES.EVENT:
        newEvent = new Event(
            obj.name,
            obj.description,
            moment(obj.startTime),
            moment(obj.endTime),
            obj.location,
            obj.locked,
            obj.notifications,
            obj.parent,
            obj.color,
        );
        break;
    // type is location event
    case EVENT_TYPES.LOCATION:
        newEvent = new LocationEvent(
            obj.name,
            obj.description,
            moment(obj.startTime),
            moment(obj.endTime),
            obj.notifications,
            obj.color,
        );

        // location events never have parents and needs to be set to -1 when deserializing
        newEvent.parent = -1;
        break;
    // type is recurring event
    case EVENT_TYPES.RECURRING:
        newEvent = new RecurringEvent(
            obj.name,
            obj.description,
            moment(obj.startTime),
            moment(obj.endTime),
            obj.location,
            obj.locked,
            obj.notifications,
            obj.color,
            obj.frequency,
            obj.optionalCustomFrequency,
        );

        // recurring events never have parents and needs to be set to -1 when deserializing
        newEvent.parent = -1;
        break;
    default:
        throw new Error('Invalid type to deserialize');
    }

    return newEvent;
}

export {
    Event,
    LocationEvent,
    RecurringEvent,
    verifyTimes,
    deserialize,
};
