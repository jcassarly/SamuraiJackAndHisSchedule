import moment from 'moment-timezone';

import { Event } from '../Event';
import { Deadline } from '../Deadline';
import autoSchedule, { getValidTimes, createEvents, TimeRange, printRanges, eventToRanges } from '../AutoScheduler';

const initialEvents = [
    new Event('test0', null, moment('2019-03-27T11:00:00Z'), moment('2019-03-27T13:00:00Z')),
    new Event('test1', null, moment('2019-03-28T08:00:00Z'), moment('2019-03-28T12:00:00Z')),
    new Event('test2', null, moment('2019-03-29T15:00:00Z'), moment('2019-03-29T18:00:00Z')),
    new Event('test3', null, moment('2019-03-30T08:00:00Z'), moment('2019-03-30T11:00:00Z')),
    new Event('test4', null, moment('2019-03-30T11:20:00Z'), moment('2019-03-30T13:00:00Z')),
    new Event('test5', null, moment('2019-03-30T13:50:00Z'), moment('2019-03-30T16:00:00Z')),
];

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
    const deadline = new Deadline('Work Times Test', 'test1', moment('2019-03-31T13:00:00Z'), 140, 30, 120, 20, moment('2019-03-24T11:00:00Z'));
    const validTimes = getValidTimes([], deadline,
        moment('2019-03-24T09:00:00Z'), moment('2019-03-24T17:00:00Z'));
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
    const deadline = new Deadline('Work Times Test', 'test2', moment('2019-03-31T13:00:00Z'), 140, 30, 120, 20, moment('2019-03-24T11:00:00Z'));
    const validTimes = getValidTimes(Object.values(initialEvents), deadline,
        moment('2019-03-24T09:00:00Z'), moment('2019-03-24T17:00:00Z'));
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

test('Create Events Empty Schedule (Day)', () => {
    const deadline = new Deadline('Work Times Test', 'test3', moment('2019-03-24T16:00:00Z'), 140, 30, 100, 20, moment('2019-03-24T10:00:00Z'));
    const validTimes = getValidTimes([], deadline,
        moment('2019-03-24T09:00:00Z'), moment('2019-03-24T17:00:00Z'));
    const newSchedule = createEvents([], deadline, validTimes);
    const correctEvents = [
        new Event('Work Times Test', null, moment('2019-03-24T10:00:00Z'), moment('2019-03-24T11:40:00Z')),
        new Event('Work Times Test', null, moment('2019-03-24T12:00:00Z'), moment('2019-03-24T12:40:00Z')),
    ];
    expect(compareEventTimes(newSchedule, correctEvents)).toBe(true);
});

test('Create Events Empty Schedule (Week)', () => {
    console.log('test4')
    const deadline = new Deadline('Work Times Test', 'test4', moment('2019-03-30T15:00:00Z'), 400, 35, 120, 25, moment('2019-03-24T11:00:00Z'));
    const validTimes = getValidTimes([], deadline,
        moment('2019-03-24T09:00:00Z'), moment('2019-03-24T17:00:00Z'));
    const newSchedule = createEvents([], deadline, validTimes);
    const correctEvents = [
        new Event('Work Times Test', null, moment('2019-03-26T09:00:00Z'), moment('2019-03-26T11:00:00Z')),
        new Event('Work Times Test', null, moment('2019-03-25T09:00:00Z'), moment('2019-03-25T11:00:00Z')),
        new Event('Work Times Test', null, moment('2019-03-27T09:00:00Z'), moment('2019-03-27T11:00:00Z')),
        new Event('Work Times Test', null, moment('2019-03-28T09:00:00Z'), moment('2019-03-28T09:40:00Z')),
    ];
    expect(compareEventTimes(newSchedule, correctEvents)).toBe(true);
});

test('Create Events Non-Empty Schedule (Week)', () => {
    const deadline = new Deadline('Work Times Test', moment('2019-03-30T15:00:00Z'), 400, 35, 120, 25, moment('2019-03-27T11:00:00Z'));
    const validTimes = getValidTimes(Object.values(initialEvents), deadline,
        moment('2019-03-24T09:00:00Z'), moment('2019-03-24T17:00:00Z'));
    const newSchedule = createEvents(Object.values(initialEvents), deadline, validTimes);
    const correctEvents = initialEvents.slice();
    correctEvents.push(
        new Event('Work Times Test', null, moment('2019-03-29T09:00:00Z'), moment('2019-03-29T11:00:00Z')),
        new Event('Work Times Test', null, moment('2019-03-28T12:25:00Z'), moment('2019-03-28T14:25:00Z')),
        new Event('Work Times Test', null, moment('2019-03-27T13:25:00Z'), moment('2019-03-27T15:25:00Z')),
        new Event('Work Times Test', null, moment('2019-03-29T11:25:00Z'), moment('2019-03-29T12:05:00Z')),
    );
    expect(compareEventTimes(newSchedule, correctEvents)).toBe(true);
});