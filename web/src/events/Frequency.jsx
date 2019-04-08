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
    // optionalCustomOptions should be null is value is not 'custom'
    constructor(event, timing, optionalCustomOptions) {
        this.eventPattern = event;
        this.setTiming(timing, optionalCustomOptions);
    }

    get timing() {
        return this._timing;
    }

    get customSettings() {
        return this._customSettings;
    }

    setTiming(value, optionalCustomOptions) {
        switch (value) {
        case Frequency.freqEnum.DAILY:
            this._timing = Frequency.freqEnum.DAILY;
            break;
        case Frequency.freqEnum.WEEKLY:
            this._timing = Frequency.freqEnum.WEEKLY;
            break;
        case Frequency.freqEnum.MONTHLY:
            this._timing = Frequency.freqEnum.MONTHLY;
            break;
        case Frequency.freqEnum.YEARLY:
            this._timing = Frequency.freqEnum.YEARLY;
            break;
        case Frequency.freqEnum.CUSTOM:
            this._timing = Frequency.freqEnum.CUSTOM;
            break;
        default:
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
