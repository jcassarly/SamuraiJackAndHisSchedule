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
        this.language = 'English';
        this.snapToGrid = 15;
        // the below value is in minutes
        this.timeBeforeDue = 300;
        // the following three values are in minutes
        this.minWorkTime = 15;
        this.maxWorkTime = 120;
        this.minBreakTime = 15;
        // the below value is in minutes
        this.timeToComplete = 60;
    }

    // Essentially an overloaded constructor
    static createSettingsfromInfo(
        lngth,
        loc,
        noteType,
        noteTime,
        locked,
        lang,
        snap,
        timeBefore,
        minWork,
        maxWork,
        minBreak,
        timeToComplete,
    ) {
        const newSettings = new Settings();
        newSettings.eventLength = lngth;
        newSettings.defaultLocation = loc;
        newSettings.defaultNotificationType = noteType;
        newSettings.defaultNotificationTimeBefore = noteTime;
        newSettings.snapToGrid = snap;
        newSettings.locked = locked;
        newSettings.language = lang;
        newSettings.timeBeforeDue = timeBefore;
        newSettings.minWorkTime = minWork;
        newSettings.maxWorkTime = maxWork;
        newSettings.minBreakTime = minBreak;
        newSettings.timeToComplete = timeToComplete;

        return newSettings;
    }

    // returns eventLength
    get eventLength() {
        return this._eventLength;
    }

    // returns location
    get defaultLocation() {
        return this._defaultLocation;
    }

    // returns notificationTimeBefore
    get defaultNotificationTimeBefore() {
        return this._defaultNotificationTimeBefore;
    }

    // returns notificationType
    get defaultNotificationType() {
        return this._defaultNotificationType;
    }

    // returns locked
    get locked() {
        return this._locked;
    }

    // returns language
    get language() {
        return this._language;
    }

    // returns snapToGrid value
    get snapToGrid() {
        return this._snapToGrid;
    }

    // returns timeBeforeDue
    get timeBeforeDue() {
        return this._timeBeforeDue;
    }

    // returns minWorkTime
    get minWorkTime() {
        return this._minWorkTime;
    }

    // returns maxWorkTime
    get maxWorkTime() {
        return this._maxWorkTime;
    }

    // returns minBreakTime
    get minBreakTime() {
        return this._minBreakTime;
    }

    // returns timeToComplete
    get timeToComplete() {
        return this._timeToComplete;
    }

    // sets eventLength to a number
    set eventLength(value) {
        this._eventLength = value;
    }

    // sets location to a string
    set defaultLocation(value) {
        this._defaultLocation = value;
    }

    // sets TimeBefore to a number
    set defaultNotificationTimeBefore(value) {
        this._defaultNotificationTimeBefore = value;
    }

    // sets notificationType to a string based on an enum
    set defaultNotificationType(value) {
        this._defaultNotificationType = value;
    }

    // sets locked to a boolean
    set locked(value) {
        this._locked = value;
    }

    // sets language to a string from a list
    set language(value) {
        this._language = value;
    }

    // sets snapToGrid to a number
    set snapToGrid(value) {
        this._snapToGrid = value;
    }

    // sets timeBeforeDue to a number
    set timeBeforeDue(value) {
        this._timeBeforeDue = value;
    }

    // sets minWorkTime to a number, provided it is not more than maxWorkTime
    set minWorkTime(value) {
        if (value > this.maxWorkTime) {
            throw new Error('minimum must be less than maximum');
        } else {
            this._minWorkTime = value;
        }
    }

    // sets maxWorkTime to a number, provided it is not less than minWorkTime
    set maxWorkTime(value) {
        if (value < this.minWorkTime) {
            throw new Error('maximum must be greater than minimum');
        } else {
            this._maxWorkTime = value;
        }
    }

    // sets minBreakTime to a number
    set minBreakTime(value) {
        this._minBreakTime = value;
    }

    // sets timeToComplete to a number
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
            language: this.language,
            snapToGrid: this.snapToGrid,
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

    return Settings.createSettingsfromInfo(
        json.eventLength,
        json.defaultLocation,
        json.defaultNotificationType,
        json.defaultNotificationTimeBefore,
        json.locked,
        json.language,
        json.snapToGrid,
        json.timeBeforeDue,
        json.minWorkTime,
        json.maxWorkTime,
        json.minBreakTime,
        json.timeToComplete,
    );
}

export { Settings, deserializeSettings };
