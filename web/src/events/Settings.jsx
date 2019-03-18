/* disable-eslint */
// Class which contains the settings information of the user
class Settings {
    constructor() {
        //the below value is in minutes
        this.eventLength = 60;
        this.defaultLocation = "anywhere";
        //the below value is in minutes
        this.defaultNotificationTimeBefore = 15;
        this.defaultNotificationType = "email";
        this.locked = true;
        //the below value is in hours.
        this.timeBeforeDue = 168;
        //the following three values are in minutes
        this.minWorkTime = 15;
        this.maxWorkTime = 120;
        this.minBreakTime = 15;
        //the below value is in hours
        this.timeToComplete = 42;
    }

    get eventLength() {
        return this._eventLength;
    }

    get defaultLocation() {
        return this._defaultLocation;
    }

    get defaultNotificationTimeBefore() {
        return this._defaultNotificationTimeBefore;
    }

    get defaultNotificationType() {
        return this._defaultNotificationType;
    }

    get locked() {
        return this._locked;
    }

    get timeBeforeDue() {
        return this._timeBeforeDue;
    }

    get minWorkTime() {
        return this._minWorkTime;
    }

    get maxWorkTime() {
        return this._maxWorkTime;
    }

    get minBreakTime() {
        return this._minBreakTime;
    }

    get timeToComplete() {
        return this._timeToComplete;
    }

    set eventLength(value) {
        this_eventLength = value;
    }

    set defaultLocation(value) {
        this._defaultLocation = value;
    }

    set defaultNotificationTimeBefore(value) {
        this._defaultNotificationTimeBefore = value;
    }

    set defaultNotificationType() {
        this._defaultNotificationType = value;
    }

    set locked(value) {
        this._locked = value;
    }

    set timeBeforeDue(value) {
        this._timeBeforeDue = value;
    }

    set minWorkTime(value) {
        if (value > maxWorkTime) {
            throw new Error("minimum must be less than maximum");
        }
        else {
            this._minWorkTime = value;
        }
    }

    set maxWorkTime(value) {
        if (value < minWorkTime) {
            throw new Error("maximum must be greater than minimum");
        }
        else {
            this._maxWorkTime = value;
        }
    }

    set minBreakTime(value) {
        this._minBreakTime = value;
    }

    set timeToComplete(value) {
        if (value > timeBeforeDue) {
            throw new Error("not enough time to work before deadline")
        }
        else {
            this._timeToComplete = value;
        }
    }
}

export default Settings;
