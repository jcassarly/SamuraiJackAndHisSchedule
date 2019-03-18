// ADD overlap function
import Frequency from './Frequency';
import Notifications from './Notifications';

const moment = require('moment');

moment().format();

// Class for events
class Event {
    constructor(name, description, startTime, endTime, location, locked, notifications, parent) {
        this.name = name;
        this.description = description;
        if (startTime === null) {
            throw new Error('Null start time is invalid');
        }
        this.startTime = startTime.clone();
        if (endTime === null) {
            throw new Error('Null end time is invalid');
        }
        this.endTime = endTime.clone();
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
        if (value === null) {
            throw new Error('Null start time is invalid');
        }
        if (moment(value).isAfter(moment(this._endTime))) {
            throw new Error('Start time after end time');
        }
        this._startTime = value;
    }

    // this takes a String as input
    set endTime(value) {
        if (value === null) {
            throw new Error('Null end time is invalid');
        }
        if (moment(value).isBefore(moment(this._startTime))) {
            throw new Error('End time before start time');
        }
        this._endTime = Date.parse(value);
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
}

// Class for events denoting only location which extends Event
class LocationEvent extends Event {
    constructor(name, description, startTime, endTime, notifications) {
        super(name, description, startTime, endTime, name, false, notifications, null);
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
}

export { Event, LocationEvent, RecurringEvent };
