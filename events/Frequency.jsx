"use strict";

//Class for Frequency
class Frequency {

    static freqEnum = {
        DAILY: 'daily',
        WEEKLY: 'weekly',
        MONTHLY: 'monthly',
        YEARLY: 'yearly',
        CUSTOM: 'custom'
    }

    // Constructor should recieve two strings. 
    // optionalCustomOptions should be null is value is not 'custom'
    constructor(value, optionalCustomOptions) {
        
        let timing = value;

        switch(timing) {
            case freqEnum.DAILY:
            this._timing = freqEnum.DAILY;
            break;
            case freqEnum.WEEKLY:
            this._timing = freqEnum.WEEKLY;
            break;
            case freqEnum.MONTHLY:
            this._timing = freqEnum.MONTHLY;
            break;
            case freqEnum.YEARLY:
            this._timing = freqEnum.YEARLY;
            break;
            case freqEnum.CUSTOM:
            this._timing = freqEnum.CUSTOM;
            break;
            default:
            throw new Error("not a valid frequency");
        }

        if (this._timing == freqEnum.CUSTOM && optionalCustomOptions != null) {
            Frequency.customParse(optionalCustomOptions);
        }
    }

    get timing() {
        return this._timing;
    }

    set timing(value, optionalCustomOptions) {
        switch(value) {
            case freqEnum.DAILY:
            this._timing = freqEnum.DAILY;
            break;
            case freqEnum.WEEKLY:
            this._timing = freqEnum.WEEKLY;
            break;
            case freqEnum.MONTHLY:
            this._timing = freqEnum.MONTHLY;
            break;
            case freqEnum.YEARLY:
            this._timing = freqEnum.YEARLY;
            break;
            case freqEnum.CUSTOM:
            this._timing = freqEnum.CUSTOM;
            break;
            default:
            throw new Error("not a valid frequency");
        }

        if (this._timing == freqEnum.CUSTOM && optionalCustomOptions != null) {
            Frequency.customParse(optionalCustomOptions);
        }
    }


}