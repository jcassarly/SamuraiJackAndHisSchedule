import moment from 'moment-timezone';

import { Event } from '../Event';
import { Deadline } from '../Deadline';
import autoSchedule, { BinaryTimeRangeHeap, getValidTimes, createEvents, TimeRange, printRanges, eventToRanges, getOptimalDurations, trimDurations } from '../AutoScheduler';

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

function compareIntegers(array1, array2) {
    let same = true;
    array1.map(function(element) {
        same = same && (element == array2.shift());
    });
    return same;
}

test('TimeRange.inRelationTo() test', () => {
    const ranges = [
        new TimeRange(moment('2019-06-24T11:10:00Z'), moment('2019-06-24T13:34:00Z')), // range 0
        new TimeRange(moment('2019-06-24T12:12:12Z'), moment('2019-06-25T14:50:00Z')), // range 1
        new TimeRange(moment('2019-06-24T14:00:00Z'), moment('2019-06-25T17:00:00Z')), // range 2
        new TimeRange(moment('2019-06-25T08:00:00Z'), moment('2019-06-25T08:03:00Z')), // range 3
        new TimeRange(moment('2019-06-25T09:00:00Z'), moment('2019-06-25T19:17:16Z')), // range 4
    ];
    expect(ranges[0].inRelationTo(ranges[2])).toBe(TimeRange.BEFORE);
    expect(ranges[0].inRelationTo(ranges[1])).toBe(TimeRange.OVERLAP_BEFORE);
    expect(ranges[2].inRelationTo(ranges[3])).toBe(TimeRange.CONTAINS);
    expect(ranges[3].inRelationTo(ranges[2])).toBe(TimeRange.CONTAINED);
    expect(ranges[4].inRelationTo(ranges[2])).toBe(TimeRange.OVERLAP_AFTER);
    expect(ranges[4].inRelationTo(ranges[0])).toBe(TimeRange.AFTER);
});

test('TimeRange.split() test', () => {
    const breakTime = 15;
    const ranges = [
        new TimeRange(moment('2019-06-24T10:10:32Z'), moment('2019-06-24T14:34:28Z')), // range to be split
        new TimeRange(moment('2019-06-24T09:12:12Z'), moment('2019-06-24T12:50:10Z')), // range OVERLAP_BEFORE
        new TimeRange(moment('2019-06-24T12:00:00Z'), moment('2019-06-24T13:30:00Z')), // range CONTAINS
        new TimeRange(moment('2019-06-24T08:00:00Z'), moment('2019-06-25T08:03:00Z')), // range CONTAINED
        new TimeRange(moment('2019-06-24T13:45:00Z'), moment('2019-06-24T19:17:16Z')), // range OVERLAP_AFTER
    ];
    const split_OVERLAP_BEFORE = [
        new TimeRange(moment('2019-06-24T12:50:10Z').add(breakTime, 'minutes'), moment('2019-06-24T14:34:28Z')),
    ];
    const ranges_OVERLAP_BEFORE = ranges[0].split(ranges[1], breakTime);
    expect(compareRanges(ranges_OVERLAP_BEFORE, split_OVERLAP_BEFORE)).toBe(true);

    const split_CONTAINS = [
        new TimeRange(moment('2019-06-24T10:10:32Z'), moment('2019-06-24T12:00:00Z').subtract(breakTime, 'minutes')),
        new TimeRange(moment('2019-06-24T13:30:00Z').add(breakTime, 'minutes'),  moment('2019-06-24T14:34:28Z')),
    ];
    expect(compareRanges(ranges[0].split(ranges[2], breakTime), split_CONTAINS)).toBe(true);

    const split_CONTAINED = [];
    expect(compareRanges(ranges[0].split(ranges[3], breakTime), split_CONTAINED)).toBe(true);

    const split_OVERLAP_AFTER = [
        new TimeRange(moment('2019-06-24T10:10:32Z'), moment('2019-06-24T13:45:00Z').subtract(breakTime, 'minutes')),
    ];
    expect(compareRanges(ranges[0].split(ranges[4], breakTime), split_OVERLAP_AFTER)).toBe(true);
});

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
        new TimeRange(moment('2019-03-30T16:20:00Z'), moment('2019-03-30T17:00:00Z')),
        new TimeRange(moment('2019-03-31T09:00:00Z'), moment('2019-03-31T13:00:00Z')),
    ];
    expect(compareRanges(validTimes, correctTimes)).toBe(true);
});

test('getOptimalDurations() test', () => {
    const deadline1 = new Deadline('Work Times Test', 'test3', moment('2019-03-31T13:00:00Z'), 140, 30, 120, 20, moment('2019-03-24T11:00:00Z'));
    const optDur1 = getOptimalDurations(deadline1.totalWorkTime, deadline1.minEventTime, deadline1.maxEventTime);
    const corDur1 = [110, 30];
    expect(compareIntegers(optDur1, corDur1)).toBe(true);
    // const trimDur1 = trimDurations(optDur1, 60);
    // const corTrim1 = [60, 50, 30];
    // expect(compareIntegers(trimDur1, corTrim1));
    
    
    const deadline2 = new Deadline('Work Times Test', 'test4', moment('2019-03-31T13:00:00Z'), 479, 15, 72, 20, moment('2019-03-24T11:00:00Z'));
    const optDur2 = getOptimalDurations(deadline2.totalWorkTime, deadline2.minEventTime, deadline2.maxEventTime);
    const corDur2 = [72, 72, 72, 72, 72, 72, 47];
    expect(compareIntegers(optDur2, corDur2)).toBe(true);

    const deadline3 = new Deadline('Work Times Test', 'test5', moment('2019-03-31T13:00:00Z'), 69, 15, 20, 20, moment('2019-03-24T11:00:00Z'));
    const optDur3 = getOptimalDurations(deadline3.totalWorkTime, deadline3.minEventTime, deadline3.maxEventTime);
    const corDur3 = [20, 19, 15, 15];
    expect(compareIntegers(optDur3, corDur3)).toBe(true);

});

test('Create Events Empty Schedule (Day)', () => {
    const deadline = new Deadline('Work Times Test', 'test3', moment('2019-03-24T16:00:00Z'), 140, 30, 100, 20, moment('2019-03-24T10:00:00Z'));
    const validTimes = getValidTimes([], deadline,
        moment('2019-03-24T09:00:00Z'), moment('2019-03-24T17:00:00Z'));
    const newSchedule = createEvents([], deadline, validTimes);
    printRanges(eventToRanges(newSchedule));
    const correctEvents = [
        new Event('Work Times Test', null, moment('2019-03-24T10:00:00Z'), moment('2019-03-24T11:40:00Z')),
        new Event('Work Times Test', null, moment('2019-03-24T12:00:00Z'), moment('2019-03-24T12:40:00Z')),
    ];
    expect(compareEventTimes(newSchedule, correctEvents)).toBe(true);
});

// test('Create Events Empty Schedule (Week)', () => {
//     console.log('test4')
//     const deadline = new Deadline('Work Times Test', 'test4', moment('2019-03-30T15:00:00Z'), 400, 35, 120, 25, moment('2019-03-24T11:00:00Z'));
//     const validTimes = getValidTimes([], deadline,
//         moment('2019-03-24T09:00:00Z'), moment('2019-03-24T17:00:00Z'));
//     const newSchedule = createEvents([], deadline, validTimes);
//     const correctEvents = [
//         new Event('Work Times Test', null, moment('2019-03-26T09:00:00Z'), moment('2019-03-26T11:00:00Z')),
//         new Event('Work Times Test', null, moment('2019-03-25T09:00:00Z'), moment('2019-03-25T11:00:00Z')),
//         new Event('Work Times Test', null, moment('2019-03-27T09:00:00Z'), moment('2019-03-27T11:00:00Z')),
//         new Event('Work Times Test', null, moment('2019-03-28T09:00:00Z'), moment('2019-03-28T09:40:00Z')),
//     ];
//     expect(compareEventTimes(newSchedule, correctEvents)).toBe(true);
// });

// test('Create Events Non-Empty Schedule (Week)', () => {
//     const deadline = new Deadline('Work Times Test', moment('2019-03-30T15:00:00Z'), 400, 35, 120, 25, moment('2019-03-27T11:00:00Z'));
//     const validTimes = getValidTimes(Object.values(initialEvents), deadline,
//         moment('2019-03-24T09:00:00Z'), moment('2019-03-24T17:00:00Z'));
//     const newSchedule = createEvents(Object.values(initialEvents), deadline, validTimes);
//     const correctEvents = initialEvents.slice();
//     correctEvents.push(
//         new Event('Work Times Test', null, moment('2019-03-29T09:00:00Z'), moment('2019-03-29T11:00:00Z')),
//         new Event('Work Times Test', null, moment('2019-03-28T12:25:00Z'), moment('2019-03-28T14:25:00Z')),
//         new Event('Work Times Test', null, moment('2019-03-27T13:25:00Z'), moment('2019-03-27T15:25:00Z')),
//         new Event('Work Times Test', null, moment('2019-03-29T11:25:00Z'), moment('2019-03-29T12:05:00Z')),
//     );
//     expect(compareEventTimes(newSchedule, correctEvents)).toBe(true);
// });