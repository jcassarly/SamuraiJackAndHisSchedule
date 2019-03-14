"use strict";

// Class for events
class Event {

    constructor(name, description, startTime, endTime, location, locked, notifications, parent) {
        this._name = name;
        this._description = description;
        this._startTime = startTime;
        this._endTime = endTime;
        this._location = location;
        this._locked = locked;
        this._notifications = notifications;
        this._parent = parent;
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

    //this takes a String as input
    set startTime(value) {
        this._startTime = Date.parse(value);
    }

    //this takes a String as input
    set endTime(value) {
        if (Date.parse(value).getTime() < startTime.getTime()) {
            throw new Error("End time before start time");
        }
        this._endTime = Data.parse(value);
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
}

// Class for events denoting only location which extends Event
class LocationEvent extends Event {

    constructor(name, description, startTime, endTime, notifications) {
        super(name, description, startTime, endTime, name, false, notifications, null);
    }
}

// Class for recurring events
class RecurringEvent extends Event {

    constructor(name, description, startTime, endTime, location, locked, notifications, frequency, optionalCustomFrequency) {
        super(name, description, startTime, endTime, location, locked, notifications, null);
        this._frequency = new Frequency(this, value, optionalCustomFrequency);
    }

    get frequency() {
        return this._frequency;
    }

    set frequency(value) {
        this._frequency = new Frequency(this, value, optionalCustomFrequency);
    }
}