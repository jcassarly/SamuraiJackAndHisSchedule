import { Event } from './Event';
import Deadline from './Deadline'
import autoSchedule from './AutoScheduler';
import { getValidTimes, createEvents, TimeRange } from './AutoScheduler';
import moment from 'moment-timezone';

const initialEvents = {
    0: new Event('test', null, moment(), moment().add(3, 'hours')),
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
    console.log(validTimes.map(displayRange));
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
    console.log(correctTimes.map(displayRange));
    expect(compareRanges(validTimes, correctTimes)).toBe(true);
});
