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
        this._eventPattern = event;

        switch (timing) {
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
            this._customSettings = Frequency.customParse(optionalCustomOptions);
        } else {
            this._customSettings = null;
        }
    }

    get timing() {
        return this._timing;
    }

    set timing(value) {
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
            this._customSettings = Frequency.customParse(optionalCustomOptions);
        } else {
            this._customSettings = null;
        }
    }
}

export default Frequency;
