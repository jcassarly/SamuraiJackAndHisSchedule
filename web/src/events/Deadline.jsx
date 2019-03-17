//the class for handling deadlines
class Deadline {
    constructor(name, deadline, totalWorkTime, minEventTime, maxEventTime, minBreak, startWorkTime, location) {
        this._name = name;
        this._createdEvents = new Array();
        this._deadline = deadline;
        this._totalWorkTime = totalWorkTime;
        this._minEventTime = minEventTime;
        this._maxEventTime = maxEventTime;
        this._minBreak = minBreak;
        this._startWorkTime = startWorkTime;
        this._location = location;
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
        this._deadline = value;
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
        this._startWorkTime = value;
    }

    set location(value) {
        this._location = value;
    }

    addEvent(event) {
        this._createdEvents.push(event);
    }

    removeEvent(event) {
        let toRemove = this._createdEvents.findIndex(item => item == event);
        this._createdEvents.splice(toRemove);
    }
}