// the class for handling deadlines
import moment from 'moment-timezone';
import { verifyTimes } from './Event';

/**
 * @param name name of the deadline
 * @param description description of deadline activity
 * @param deadline time by which the events created by this deadline must end
 * @param totalWorkTime minimum amount of time the events must collectively include
 * @param minEventTime minimum time an event created by this deadline can take up
 * @param maxEventTime maximum time an event created by this deadline can take up
 * @param minBreak minimum break time between events created by this deadline
 * @param startWorkTime the time after which events created by this deadline are created
 * @param location the location of this event, if it has one
 * @param useLocation whether this event uses a location
 */
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

    // returns name
    get name() {
        return this._name;
    }

    // returns createdEvents
    get createdEvents() {
        return this._createdEvents;
    }

    // returns deadline
    get deadline() {
        return this._deadline;
    }

    // returns totalWorkTime
    get totalWorkTime() {
        return this._totalWorkTime;
    }

    // returns minEventTime
    get minEventTime() {
        return this._minEventTime;
    }

    // returns maxEventTime
    get maxEventTime() {
        return this._maxEventTime;
    }

    // returns minBreak
    get minBreak() {
        return this._minBreak;
    }

    // returns startWorkTime
    get startWorkTime() {
        return this._startWorkTime;
    }

    // returns location
    get location() {
        return this._location;
    }

    // return useLocation
    get useLocation() {
        return this._useLocation;
    }

    /**
     * Returns the id of the deadline in the redux store. -1 if it has not been set yet
     */
    get id() {
        return this._id;
    }

    // sets the value of name to a string
    set name(value) {
        this._name = value;
    }

    // sets the value of deadline to a string
    set deadline(value) {
        verifyTimes(this._startWorkTime, value);
        this._startWorkTime = value;
    }

    // sets totalWorkTime to a number
    set totalWorkTime(value) {
        this._totalWorkTime = value;
    }

    // sets minEventTime to a number
    set minEventTime(value) {
        this._minEventTime = value;
    }

    // sets maxEventTime to a number
    set maxEventTime(value) {
        this._maxEventTime = value;
    }

    // sets minBreak to a number
    set minBreak(value) {
        this._minBreak = value;
    }

    // sets startWorkTime to a moment
    set startWorkTime(value) {
        verifyTimes(value, this._deadline);
        this._startWorkTime = value;
    }

    // sets location to a string
    set location(value) {
        this._location = value;
    }

    // sets the value of uselocation to a boolean
    set useLocation(value) {
        this._useLocation = value;
    }

    /**
     * Set the id of the Deadline in the redux store to value
     * @param {int} value the new id
     */
    set id(value) {
        this._id = value;
    }

    /**
     * Sets the event at an index to newEvent
     * @param {*} index the index at which to add an event
     * @param {*} newEvent the event to be added
     */
    setEvent(index, newEvent) {
        this._createdEvents[index] = newEvent;
    }

    /**
     * adds an event to createdEvents
     * @param {*} event the event to be added
     */
    addEvent(event) {
        this._createdEvents.push(event);
    }

    /**
     * removes an event from createdEvents
     * @param {integer} id the event to be removed
     */
    removeEvent(id) {
        const toRemove = this._createdEvents.findIndex(item => item.id === id);
        this._createdEvents.splice(toRemove);
    }

    /**
     * clones the deadline
     * returns a new Deadline
     */
    clone() {
        const dead = new Deadline(this.name, this.description, this.deadline, this.totalWorkTime,
            this.minEventTime, this.maxEventTime, this.minBreak, this.startWorkTime,
            this.location, this.useLocation);
        dead._createdEvents = this._createdEvents;
        return dead;
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
            description: this.description,
            createdEvents: childEvents,
            deadline: this._deadline,
            startWorkTime: this._startWorkTime,
            totalWorkTime: this.totalWorkTime,
            minEventTime: this.minEventTime,
            maxEventTime: this.maxEventTime,
            minBreak: this.minBreak,
            location: this.location,
            useLocation: this.useLocation,
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
        json.description,
        moment(json.deadline),
        json.totalWorkTime,
        json.minEventTime,
        json.maxEventTime,
        json.minBreak,
        moment(json.startWorkTime),
        json.location,
        json.useLocation,
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
