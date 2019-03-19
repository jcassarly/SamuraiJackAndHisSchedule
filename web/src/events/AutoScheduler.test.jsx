import { Event } from './Event';
import Deadline from './Deadline'
import autoSchedule from './AutoScheduler';
import { getValidTimes, createEvents, TimeRange } from './AutoScheduler';
import moment from 'moment-timezone';

const initialEvents = {
    0: new Event('test0', null, moment('03/27/2019 11:00:00'), moment('03/27/2019 13:00:00')),
    1: new Event('test1', null, moment('03/28/2019 08:00:00'), moment('03/28/2019 12:00:00')),
    2: new Event('test2', null, moment('03/29/2019 15:00:00'), moment('03/29/2019 18:00:00')),
    3: new Event('test3', null, moment('03/30/2019 08:00:00'), moment('03/30/2019 11:00:00')),
    4: new Event('test4', null, moment('03/30/2019 11:20:00'), moment('03/30/2019 13:00:00')),
    5: new Event('test5', null, moment('03/30/2019 13:50:00'), moment('03/30/2019 16:00:00')),
};

function displayRange(range) {
    return range.start.format('LLL') + " to " + range.end.format('LLL');
}

function compareRanges(array1, array2) {
    let returnValue = false;
    if (array1.length == array2.length) {
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

test('Valid Daily Work Times', () => {
    const deadline = new Deadline('Work Times Test', moment('03/31/2019 13:00:00'), 5, 30, 120, 20, moment('03/24/2019 11:00:00'));
    let validTimes = getValidTimes([], deadline, moment().hour(9).minute(0), moment().hour(17).minute(0));
    const correctTimes = [ 
        new TimeRange(moment('03/24/2019 11:00:00'), moment('03/24/2019 17:00:00')),
        new TimeRange(moment('03/25/2019 09:00:00'), moment('03/25/2019 17:00:00')),
        new TimeRange(moment('03/26/2019 09:00:00'), moment('03/26/2019 17:00:00')),
        new TimeRange(moment('03/27/2019 09:00:00'), moment('03/27/2019 17:00:00')),
        new TimeRange(moment('03/28/2019 09:00:00'), moment('03/28/2019 17:00:00')),
        new TimeRange(moment('03/29/2019 09:00:00'), moment('03/29/2019 17:00:00')),
        new TimeRange(moment('03/30/2019 09:00:00'), moment('03/30/2019 17:00:00')),
        new TimeRange(moment('03/31/2019 09:00:00'), moment('03/31/2019 13:00:00'))
    ]
    expect(compareRanges(validTimes, correctTimes)).toBe(true);
});

test('Valid Range Split', () => {
    const deadline = new Deadline('Work Times Test', moment('03/31/2019 13:00:00'), 5, 30, 120, 20, moment('03/24/2019 11:00:00'));
    let validTimes = getValidTimes(Object.values(initialEvents), deadline, moment().hour(9).minute(0), moment().hour(17).minute(0));
    const correctTimes = [ 
        new TimeRange(moment('03/24/2019 11:00:00'), moment('03/24/2019 17:00:00')),
        new TimeRange(moment('03/25/2019 09:00:00'), moment('03/25/2019 17:00:00')),
        new TimeRange(moment('03/26/2019 09:00:00'), moment('03/26/2019 17:00:00')),
        new TimeRange(moment('03/27/2019 09:00:00'), moment('03/27/2019 10:40:00')),
        new TimeRange(moment('03/27/2019 13:20:00'), moment('03/27/2019 17:00:00')),
        new TimeRange(moment('03/28/2019 12:20:00'), moment('03/28/2019 17:00:00')),
        new TimeRange(moment('03/29/2019 09:00:00'), moment('03/29/2019 14:40:00')),
        new TimeRange(moment('03/30/2019 13:20:00'), moment('03/30/2019 13:30:00')),
        new TimeRange(moment('03/30/2019 16:20:00'), moment('03/30/2019 17:00:00')),
        new TimeRange(moment('03/31/2019 09:00:00'), moment('03/31/2019 13:00:00'))
    ]
    expect(compareRanges(validTimes, correctTimes)).toBe(true);
});

test('Valid Range Split', () => {
    const deadline = new Deadline('Work Times Test', moment('03/31/2019 13:00:00'), 5, 30, 120, 20, moment('03/24/2019 11:00:00'));
    let validTimes = getValidTimes([], deadline, moment().hour(9).minute(0), moment().hour(17).minute(0));
    console.log(validTimes.map(displayRange));
    console.log(correctTimes.map(displayRange));
    //expect(compareRanges(validTimes, correctTimes)).toBe(true);
    let newSchedule = createEvents([], deadline, validTimes);
    newSchedule.map((event) => {
        console.log(`Event Name: ${event.name}`)
        console.log(`    ${event.name} startTime: ${event.startTime}`)
        console.log(`    ${event.name} endTime: ${event.endTime}`)
    });
});