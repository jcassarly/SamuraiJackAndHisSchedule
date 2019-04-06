import moment from 'moment-timezone';

import { Event } from '../Event';
import Deadline from '../Deadline';
import autoSchedule, { getValidTimes, createEvents, TimeRange } from '../AutoScheduler';

const initialEvents = {
    0: new Event('test0', null, moment('2019-03-27T11:00:00Z'), moment('2019-03-27T13:00:00Z')),
    1: new Event('test1', null, moment('2019-03-28T08:00:00Z'), moment('2019-03-28T12:00:00Z')),
    2: new Event('test2', null, moment('2019-03-29T15:00:00Z'), moment('2019-03-29T18:00:00Z')),
    3: new Event('test3', null, moment('2019-03-30T08:00:00Z'), moment('2019-03-30T11:00:00Z')),
    4: new Event('test4', null, moment('2019-03-30T11:20:00Z'), moment('2019-03-30T13:00:00Z')),
    5: new Event('test5', null, moment('2019-03-30T13:50:00Z'), moment('2019-03-30T16:00:00Z')),
};

function displayRange(range) {
    return `${range.start.format('LLL')} to ${range.end.format('LLL')}`;
}

function compareRanges(array1, array2) {
    let returnValue = false;
    if (array1.length === array2.length) {
        returnValue = true;
        for (let i = 0; i < array1.length; i += 1) {
            if (!(array1[i].start.isSame(array2[i].start) && array1[i].end.isSame(array2[i].end))) {
                returnValue = false;
                break;
            }
        }
    }
    return returnValue;
}

function compareEventTimes(array1, array2) {
    let returnValue = false;
    if (array1.length === array2.length) {
        returnValue = true;
        for (let i = 0; i < array1.length; i += 1) {
            if (!(array1[i].startTime.isSame(array2[i].startTime)
                && array1[i].endTime.isSame(array2[i].endTime))) {
                returnValue = false;
                break;
            }
        }
    }
    return returnValue;
}

test('Valid Daily Work Times', () => {
    const deadline = new Deadline('Work Times Test', moment('2019-03-31T13:00:00Z'), 5, 30, 120, 20, moment('2019-03-24T11:00:00Z'));
    const validTimes = getValidTimes([], deadline,
        moment().hour(9).minute(0), moment().hour(17).minute(0));
    const correctTimes = [
        new TimeRange(moment('2019-03-24T11:00:00Z'), moment('2019-03-24T17:00:00Z')),
        new TimeRange(moment('2019-03-25T09:00:00Z'), moment('2019-03-25T17:00:00Z')),
        new TimeRange(moment('2019-03-26T09:00:00Z'), moment('2019-03-26T17:00:00Z')),
        new TimeRange(moment('2019-03-27T09:00:00Z'), moment('2019-03-27T17:00:00Z')),
        new TimeRange(moment('2019-03-28T09:00:00Z'), moment('2019-03-28T17:00:00Z')),
        new TimeRange(moment('2019-03-29T09:00:00Z'), moment('2019-03-29T17:00:00Z')),
        new TimeRange(moment('2019-03-30T09:00:00Z'), moment('2019-03-30T17:00:00Z')),
        new TimeRange(moment('2019-03-31T09:00:00Z'), moment('2019-03-31T13:00:00Z')),
    ];
    expect(compareRanges(validTimes, correctTimes)).toBe(true);
});

test('Valid Range Split', () => {
    const deadline = new Deadline('Work Times Test', moment('2019-03-31T13:00:00Z'), 5, 30, 120, 20, moment('2019-03-24T11:00:00Z'));
    const validTimes = getValidTimes(Object.values(initialEvents), deadline,
        moment().hour(9).minute(0), moment().hour(17).minute(0));
    const correctTimes = [
        new TimeRange(moment('2019-03-24T11:00:00Z'), moment('2019-03-24T17:00:00Z')),
        new TimeRange(moment('2019-03-25T09:00:00Z'), moment('2019-03-25T17:00:00Z')),
        new TimeRange(moment('2019-03-26T09:00:00Z'), moment('2019-03-26T17:00:00Z')),
        new TimeRange(moment('2019-03-27T09:00:00Z'), moment('2019-03-27T10:40:00Z')),
        new TimeRange(moment('2019-03-27T13:20:00Z'), moment('2019-03-27T17:00:00Z')),
        new TimeRange(moment('2019-03-28T12:20:00Z'), moment('2019-03-28T17:00:00Z')),
        new TimeRange(moment('2019-03-29T09:00:00Z'), moment('2019-03-29T14:40:00Z')),
        new TimeRange(moment('2019-03-30T13:20:00Z'), moment('2019-03-30T13:30:00Z')),
        new TimeRange(moment('2019-03-30T16:20:00Z'), moment('2019-03-30T17:00:00Z')),
        new TimeRange(moment('2019-03-31T09:00:00Z'), moment('2019-03-31T13:00:00Z')),
    ];
    expect(compareRanges(validTimes, correctTimes)).toBe(true);
});

test('Create Events Empty Schedule', () => {
    const deadline = new Deadline('Work Times Test', moment('2019-03-31T13:00:00Z'), 5, 30, 120, 20, moment('2019-03-24T11:00:00Z'));
    const validTimes = getValidTimes([], deadline,
        moment().hour(9).minute(0), moment().hour(17).minute(0));
    // console.log(validTimes.map(displayRange));
    const newSchedule = createEvents([], deadline, validTimes);
    const correctEvents = [
        new Event('Work Times Test', null, moment('2019-03-25T09:00:00Z'), moment('2019-03-25T11:00:00Z')),
        new Event('Work Times Test', null, moment('2019-03-26T09:00:00Z'), moment('2019-03-26T11:00:00Z')),
        new Event('Work Times Test', null, moment('2019-03-30T09:00:00Z'), moment('2019-03-30T10:00:00Z')),
    ];
    expect(compareEventTimes(newSchedule, correctEvents)).toBe(true);
});
