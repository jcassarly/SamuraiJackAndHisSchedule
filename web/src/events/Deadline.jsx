// the class for handling deadlines
const moment = require('moment');

class Deadline {
    constructor(name, deadline, totalWorkTime, minEventTime, maxEventTime,
        minBreak, startWorkTime, location) {
        this.name = name;
        this.createdEvents = [];
        this.deadline = deadline;
        this.totalWorkTime = totalWorkTime;
        this.minEventTime = minEventTime;
        this.maxEventTime = maxEventTime;
        this.minBreak = minBreak;
        this.startWorkTime = startWorkTime;
        this.location = location;
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

    set name(value) {
        this._name = value;
    }

    set deadline(value) {
        if (value === null) {
            throw new Error('Null start time is invalid');
        }
        if (moment(value).isBefore(moment(this._startWorkTime))) {
            throw new Error('Cannot begin work after deadline');
        }
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
        if (value === null) {
            throw new Error('Null start time is invalid');
        }
        if (moment(value).isAfter(moment(this._deadline))) {
            throw new Error('Cannot begin work after deadline');
        }
        this._startWorkTime = value;
    }

    set location(value) {
        this._location = value;
    }

    addEvent(event) {
        this._createdEvents.push(event);
    }

    removeEvent(event) {
        const toRemove = this._createdEvents.findIndex(item => item === event);
        this._createdEvents.splice(toRemove);
    }
}

export default Deadline;
