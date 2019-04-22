const MILLIS_IN_DAY = 86400000;
const MILLIS_IN_WEEK = MILLIS_IN_DAY * 7;
const MILLIS_IN_MONTH = MILLIS_IN_WEEK * 4;
const MILLIS_IN_YEAR = MILLIS_IN_DAY * 365;

// Class for Frequency
class Frequency {
    static freqEnum = {
        DAILY: 'daily',
        WEEKLY: 'weekly',
        MONTHLY: 'monthly',
        YEARLY: 'yearly',
        CUSTOM: 'custom',
    }

    // Constructor should recieve an event object and two strings.
    // optionalCustomOptions should be null if value is not 'custom'
    constructor(event, timing, optionalCustomOptions) {
        this.eventPattern = event;
        this.setTiming(timing, optionalCustomOptions);
    }

    // returns timing
    get timing() {
        return this._timing;
    }

    // returns customSettings
    get customSettings() {
        return this._customSettings;
    }

    // sets Timing to a string based on an enum, TODO:OptionalCustomOptions does anything
    setTiming(value, optionalCustomOptions) {
        switch (value) {
        case Frequency.freqEnum.DAILY:
            this._timing = Frequency.freqEnum.DAILY;

            if (this.eventPattern.endTime.diff(
                this.eventPattern.startTime, 'milliseconds',
            ) > MILLIS_IN_DAY) {
                throw new Error('Duration for a recurring daily event must be less than 1 day');
            }
            break;
        case Frequency.freqEnum.WEEKLY:
            this._timing = Frequency.freqEnum.WEEKLY;

            if (this.eventPattern.endTime.diff(
                this.eventPattern.startTime, 'milliseconds',
            ) > MILLIS_IN_WEEK) {
                throw new Error('Duration for a recurring weekly event must be less than 1 weeks');
            }
            break;
        case Frequency.freqEnum.MONTHLY: {
            this._timing = Frequency.freqEnum.MONTHLY;

            // the behavior for events greater than 28 days do not have a clear way to handle them
            // due to the number of days varying between months

            if (this.eventPattern.endTime.diff(
                this.eventPattern.startTime, 'milliseconds',
            ) > MILLIS_IN_MONTH) {
                throw new Error('Duration for a recurring monthly event must be less than 1 month');
            }
            break;
        }
        case Frequency.freqEnum.YEARLY:
            this._timing = Frequency.freqEnum.YEARLY;

            if (this.eventPattern.endTime.diff(
                this.eventPattern.startTime, 'milliseconds',
            ) > MILLIS_IN_YEAR) {
                throw new Error('Duration for a recurring yearly event must be less than 1 year');
            }
            break;
        case Frequency.freqEnum.CUSTOM:
            this._timing = Frequency.freqEnum.CUSTOM;
            break;
        default:
            console.log(value);
            throw new Error('not a valid frequency');
        }

        if (this._timing === Frequency.freqEnum.CUSTOM && optionalCustomOptions != null) {
            this._customSettings = optionalCustomOptions;
        } else {
            this._customSettings = null;
        }
    }
}

export default Frequency;
