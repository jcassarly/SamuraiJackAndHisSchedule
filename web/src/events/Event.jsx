import Frequency from './Frequency';
import Notifications from './Notifications';

const moment = require('moment-timezone');

moment().format();

const EVENT_TYPES = {
    EVENT: 'event',
    LOCATION: 'location',
    RECURRING: 'recurring',
};

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

// Class for events
class Event {
    constructor(name, description, startTime, endTime, location, locked, notifications, parent) {
        this.name = name;
        this.description = description;

        verifyTimes(startTime, endTime);
        this._startTime = startTime.clone();
        this._endTime = endTime.clone();

        this.location = location;
        this.locked = locked;
        this.notifications = notifications;
        this.parent = parent;
    }

    get name() {
        return this._name;
    }

    get description() {
        return this._description;
    }

    get startTime() {
        return this._startTime;
    }

    get endTime() {
        return this._endTime;
    }

    get location() {
        return this._location;
    }

    get locked() {
        return this._locked;
    }

    get notifications() {
        return this._notifications;
    }

    get parent() {
        return this._parent;
    }

    set name(value) {
        this._name = value;
    }

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

    set location(value) {
        this._location = value;
    }

    set locked(value) {
        this._locked = value;
    }

    set notifications(value) {
        this._notifications = value;
    }

    set parent(value) {
        this._parent = value;
    }

    addNotification(timeBefore, type) {
        this._notifications.push(new Notifications(type, timeBefore, this._startTime));
    }

    removeNotification(notification) {
        const toRemove = this._notifications.findIndex(item => item.equals(notification));
        this._notifications.splice(toRemove);
    }

    static overlap(event1, event2) {
        if (event1.startTime.isAfter(event2.startTime)
        && event1.startTime.isBefore(event2.endTime)) {
            return true;
        } if (event2.startTime.isAfter(event1.startTime)
        && event2.startTime.isBefore(event1.endTime)) {
            return true;
        } if (event1.endTime.isAfter(event2.startTime)
        && event1.endTime.isBefore(event2.endTime)) {
            return true;
        } if (event2.endTime.isAfter(event1.startTime)
        && event2.endTime.isBefore(event1.endTime)) {
            return true;
        }
        return false;
    }

    serialize() {
        return {
            type: EVENT_TYPES.EVENT,
            obj: {
                name: this.name,
                description: this.description,
                startTime: this.startTime,
                endTime: this.endTime,
                location: this.location,
                locked: this.locked,
                notifications: this.notifications,
                parent: this.parent,
            },
        };
    }
}

// Class for events denoting only location which extends Event
class LocationEvent extends Event {
    constructor(name, description, startTime, endTime, notifications) {
        super(name, description, startTime, endTime, name, true, notifications, null);
    }

    serialize() {
        const retval = super.serialize();
        retval.type = EVENT_TYPES.LOCATION;

        return retval;
    }
}

// Class for recurring events
class RecurringEvent extends Event {
    constructor(name, description, startTime, endTime, location, locked,
        notifications, frequency, optionalCustomFrequency) {
        super(name, description, startTime, endTime, location, locked, notifications, null);
        this._frequency = new Frequency(this, frequency, optionalCustomFrequency);
    }

    get frequency() {
        return this._frequency;
    }

    set frequency(value) {
        this._frequency = value;
    }

    serialize() {
        const retval = super.serialize();
        retval.type = EVENT_TYPES.RECURRING;
        retval.obj = {
            ...retval,
            frequency: this._frequency.timing,
            optionalCustomFrequency: this._frequency.customSettings,
        };
        return retval;
    }
}

function deserialize(jsonStr) {
    const json = JSON.parse(jsonStr);
    const { type, obj } = json;

    switch (type) {
    case EVENT_TYPES.EVENT:
        return new Event(
            obj.name,
            obj.description,
            moment(obj.startTime),
            moment(obj.endTime),
            obj.location,
            obj.locked,
            obj.notifications,
            obj.parent,
        );
    case EVENT_TYPES.LOCATION:
        return new LocationEvent(
            obj.name,
            obj.description,
            moment(obj.startTime),
            moment(obj.endTime),
            obj.notifications,
        );
    case EVENT_TYPES.RECURRING:
        return new RecurringEvent(
            obj.name,
            obj.description,
            moment(obj.startTime),
            moment(obj.endTime),
            obj.location,
            obj.locked,
            obj.notifications,
            obj.frequency,
            obj.optionalCustomFrequency,
        );
    default:
        throw new Error('Invalid type to deserialize');
    }
}

export {
    Event,
    LocationEvent,
    RecurringEvent,
    verifyTimes,
    deserialize,
};
