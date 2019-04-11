// the class for handling deadlines
import moment from 'moment-timezone';
import { verifyTimes } from './Event';

class Deadline {
    constructor(name, description, deadline, totalWorkTime, minEventTime, maxEventTime,
        minBreak, startWorkTime, location, useLocation) {
        this.name = name;
        this._createdEvents = [];

        verifyTimes(startWorkTime, deadline);
        this._deadline = deadline.clone();
        this._startWorkTime = startWorkTime.clone();
        this.description = description;

        this.totalWorkTime = totalWorkTime;
        this.minEventTime = minEventTime;
        this.maxEventTime = maxEventTime;
        this.minBreak = minBreak;
        this.location = location;
        this.useLocation = useLocation;

        this.id = -1; // default is no id - it gets set later
    }

    get name() {
        return this._name;
    }

    get createdEvents() {
        return this._createdEvents;
    }

    get deadline() {
        return this._deadline;
    }

    get totalWorkTime() {
        return this._totalWorkTime;
    }

    get minEventTime() {
        return this._minEventTime;
    }

    get maxEventTime() {
        return this._maxEventTime;
    }

    get minBreak() {
        return this._minBreak;
    }

    get startWorkTime() {
        return this._startWorkTime;
    }

    get location() {
        return this._location;
    }

    /**
     * Returns the id of the deadline in the redux store. -1 if it has not been set yet
     */
    get id() {
        return this._id;
    }

    set name(value) {
        this._name = value;
    }

    set deadline(value) {
        verifyTimes(this._startWorkTime, value);
        this._startWorkTime = value;
    }

    set totalWorkTime(value) {
        this._totalWorkTime = value;
    }

    set minEventTime(value) {
        this._minEventTime = value;
    }

    set maxEventTime(value) {
        this._maxEventTime = value;
    }

    set minBreak(value) {
        this._minBreak = value;
    }

    set startWorkTime(value) {
        verifyTimes(value, this._deadline);
        this._startWorkTime = value;
    }

    set location(value) {
        this._location = value;
    }

    /**
     * Set the id of the Deadline in the redux store to value
     * @param {int} value the new id
     */
    set id(value) {
        this._id = value;
    }

    setEvent(index, newEvent) {
        this._createdEvents[index] = newEvent;
    }

    addEvent(event) {
        this._createdEvents.push(event);
    }

    removeEvent(event) {
        const toRemove = this._createdEvents.findIndex(item => item === event);
        this._createdEvents.splice(toRemove);
    }

    /**
     * Serialize this deadline object so it can be stored
     * returns a JSON string with the deadline object
     */
    serialize() {
        // convert the created events to their IDs for serialization
        const childEvents = [];
        this._createdEvents.forEach((child) => {
            childEvents.push(child.id);
        });

        return {
            id: this.id,
            name: this.name,
            createdEvents: childEvents,
            deadline: this._deadline,
            startWorkTime: this._startWorkTime,
            totalWorkTime: this.totalWorkTime,
            minEventTime: this.minEventTime,
            maxEventTime: this.maxEventTime,
            minBreak: this.minBreak,
            location: this.location,
        };
    }
}

/**
 * Deserializes a JSON string containing a Deadline object
 * (should have the same form as the output of the serialize methods for a Deadline)
 * @param {string} jsonStr a JSON string containing one Deadline
 * Returns a Deadline parsed from the jsonStr
 */
function deserializeDeadline(jsonStr) {
    const json = JSON.parse(jsonStr);
    const dl = new Deadline(
        json.name,
        moment(json.deadline),
        json.totalWorkTime,
        json.minEventTime,
        json.maxEventTime,
        json.minBreak,
        moment(json.startWorkTime),
        json.location,
    );

    // add the child events to the json object
    json.createdEvents.forEach((e) => {
        dl.addEvent(e);
    });

    return dl;
}

export {
    Deadline,
    deserializeDeadline,
};
