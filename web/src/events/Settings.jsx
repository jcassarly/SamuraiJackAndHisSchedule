// Class which contains the settings information of the user
class Settings {
    constructor() {
        // the below value is in minutes
        this.eventLength = 60;
        this.defaultLocation = 'anywhere';
        // the below value is in minutes
        this.defaultNotificationTimeBefore = 15;
        this.defaultNotificationType = 'email';
        this.locked = true;
        // the below value is in hours.
        this.timeBeforeDue = 168;
        // the following three values are in minutes
        this.minWorkTime = 15;
        this.maxWorkTime = 120;
        this.minBreakTime = 15;
        // the below value is in hours
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
        this._eventLength = value;
    }

    set defaultLocation(value) {
        this._defaultLocation = value;
    }

    set defaultNotificationTimeBefore(value) {
        this._defaultNotificationTimeBefore = value;
    }

    set defaultNotificationType(value) {
        this._defaultNotificationType = value;
    }

    set locked(value) {
        this._locked = value;
    }

    set timeBeforeDue(value) {
        this._timeBeforeDue = value;
    }

    set minWorkTime(value) {
        if (value > this.maxWorkTime) {
            throw new Error('minimum must be less than maximum');
        } else {
            this._minWorkTime = value;
        }
    }

    set maxWorkTime(value) {
        if (value < this.minWorkTime) {
            throw new Error('maximum must be greater than minimum');
        } else {
            this._maxWorkTime = value;
        }
    }

    set minBreakTime(value) {
        this._minBreakTime = value;
    }

    set timeToComplete(value) {
        if (value > this.timeBeforeDue) {
            throw new Error('not enough time to work before deadline');
        } else {
            this._timeToComplete = value;
        }
    }

    /**
     * Serialize this Settings object so it can be stored
     * returns a JSON string with the Settings object
     */
    serialize() {
        return {
            eventLength: this.eventLength,
            defaultLocation: this.defaultLocation,
            defaultNotificationTimeBefore: this.defaultNotificationTimeBefore,
            defaultNotificationType: this.defaultNotificationType,
            locked: this.locked,
            timeBeforeDue: this.timeBeforeDue,
            minWorkTime: this.minWorkTime,
            maxWorkTime: this.maxWorkTime,
            minBreakTime: this.minBreakTime,
            timeToComplete: this.timeToComplete,
        };
    }
}

/**
 * Deserializes a JSON string containing a Settings object
 * (should have the same form as the output of the serialize methods for a Serialize)
 * @param {string} jsonStr a JSON string containing the Settings
 * Returns the Settings object parsed from the jsonStr
 */
function deserializeSettings(jsonStr) {
    const json = JSON.parse(jsonStr);
    const settings = new Settings();

    settings.eventLength = json.eventLength;
    settings.defaultLocation = json.defaultLocation;
    settings.defaultNotificationTimeBefore = json.defaultNotificationTimeBefore;
    settings.defaultNotificationType = json.defaultNotificationType;
    settings.locked = json.locked;
    settings.timeBeforeDue = json.timeBeforeDue;
    settings.minWorkTime = json.minWorkTime;
    settings.maxWorkTime = json.maxWorkTime;
    settings.minBreakTime = json.minBreakTime;
    settings.timeToComplete = json.timeToComplete;

    return settings;
}

export { Settings, deserializeSettings };
