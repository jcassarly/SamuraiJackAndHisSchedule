/* eslint-disable */
/* eslint max-len: 0 */
import moment from 'moment-timezone'; // eslint-disable-line
import { Event } from './Event';
import ColorEnum from '../components/ColorEnum';

/**
 * Represents a range of time.
 */
class TimeRange {
    constructor(start, end) {
        this.start = start;
        this.end = end;
    }

    // get start() {
    //     return this.start;
    // }

    // get end() {
    //     return this.end;
    // }

    // set start(newStart) {
    //     this.start = newStart;
    // }

    // set end(newEnd) {
    //     this.end = newEnd;
    // }

    inRange(time) {
        return (this.start.isBefore(time) && this.end.isAfter(time)); // Use moment().format('x') to get time in Unix time (seconds since 1970)
    }

    duration() {
        return (this.end.format('x') - this.start.format('x')) / 60 / 1000;
    }
}

class BinaryTimeRangeHeap {
    constructor(array) {
        this.array = array;
        this.heapify();
    }

    siftUp(givenIndex) {
        let index = givenIndex;
        if (index >= 0 && index < this.array.length) {
            while (index > 0) {
                const parent = Math.floor((index - 1) / 2);
                if (this.array[index].duration() > this.array[parent].duration()) {
                    const temp = this.array[index];
                    this.array[index] = this.array[parent];
                    this.array[parent] = temp;
                }
                index = parent;
            }
        }
    }

    siftDown(givenIndex) {
        let index = givenIndex;
        if (index >= 0 && index < this.array.length) {
            while (index < Math.floor(this.array.length / 2)) {
                const leftChild = (index + 1) * 2 - 1;
                const rightChild = (index + 1) * 2;
                let largerChild;

                if (this.array[leftChild].duration() > this.array[rightChild].duration()) {
                    largerChild = leftChild;
                } else {
                    largerChild = rightChild;
                }

                if (this.array[largerChild].duration() > this.array[index].duration()) {
                    const temp = this.array[index];
                    this.array[index] = this.array[largerChild];
                    this.array[largerChild] = temp;
                }
                index = largerChild;
            }
        }
    }

    heapify() {
        for (let i = this.array.length - 1; i >= 0; i -= 1) {
            this.siftUp(i);
        }
    }

    push(newRange) {
        this.array.push(newRange); // Add the new timerange to the this.array
        this.siftUp(this.array.length - 1); // Sift the new timerange up
    }

    pop() {
        const returnValue = this.array[0]; // Save the first range in the this.array (longest duration)
        this.array[0] = this.array.pop(); // Move the last range in the this.array to the top
        this.siftDown(0); // Sift the new top down
        return returnValue; // return the original top of the heap
    }

    get length() {
        return this.array.length;
    }
}

/**
 * Returns an array of TimeRange objects for valid times when new events can be scheduled.
 * Helper Function for autoSchedule.
 * @param {*} oldSchedule     Event[] representing the current schedule.
 * @param {*} deadline        An instance of the deadline class.
 *                            Interface Used:
 *                              - get deadline
 *                              - get minBreak
 *                              - get startWorkTime
 * @param {*} workHoursStart  Moment object for time of day user can work after.
 * @param {*} workHoursFin    Moment object for time of day user cannot work after.
 */
function getValidTimes(oldSchedule, deadline, workHoursStart, workHoursFin) { // eslint-disable-line
    const workRange = new TimeRange(deadline.startWorkTime, deadline.deadline);
    // eslint-disable-next-line prefer-const
    let validTimes = [];

    // Add valid ranges for the valid working times of each day between startWorkTime and deadline.
    const dailyStart = moment(deadline.startWorkTime).hour(workHoursStart.hour()).minute(workHoursStart.minute());
    let start = moment(moment.max(deadline.startWorkTime, dailyStart));
    const dailyEnd = moment(deadline.startWorkTime).hour(workHoursFin.hour()).minute(workHoursFin.minute());
    const finalEnd = moment(moment.min(deadline.deadline, moment(deadline.deadline).hour(workHoursFin.hour()).minute(workHoursFin.minute())));
    while (dailyEnd.isBefore(finalEnd)) {
        validTimes.push(new TimeRange(moment(start), moment(dailyEnd)));
        start = dailyStart.add(1, 'days');
        dailyEnd.add(1, 'days');
    }
    validTimes.push(new TimeRange(start, finalEnd));

    // Iterates through the schedule and gets valid times to schedule new events
    // Currently assuming the events are sorted chronologically and do not overlap
    //                                                                                                    TODO: Account for non-chronological and overlapping events
    for (let j = 0; j < oldSchedule.length; j += 1) {
        const event = oldSchedule[j];
        if (workRange.inRange(event.startTime) || workRange.inRange(event.endTime)) {
            /* Check if the event overlaps with a currently valid time range */
            //                                                                                            TODO: Find a more efficient method to do this.
            for (let i = validTimes.length - 1; i >= 0; i -= 1) {
                if (validTimes[i].inRange(event.startTime) && validTimes[i].inRange(event.endTime)) { // The event is contained within a valid time range, split into two separate time ranges before and after
                    const prevEnd = moment(validTimes[i].end);

                    let validBefore = true;
                    const newEnd = moment(event.startTime).subtract(deadline.minBreak, 'minutes');
                    if (validTimes[i].start.isBefore(newEnd)) { // If there is a valid period before the event
                        validTimes[i].end = moment(newEnd); // Change the valid time range's end to before the start of the event and a break
                    } else {
                        validBefore = false; // Else there is no valid time range before the event
                    }

                    let validAfter = true;
                    const newStart = moment(event.endTime).add(deadline.minBreak, 'minutes');

                    if (prevEnd.isAfter(newStart)) { // If there is a valid period after the event
                        if (validBefore) { // If there was a valid period before, insert a new time period afer the event
                            validTimes.splice(i + 1, 0, new TimeRange(moment(newStart), moment(prevEnd)));
                        } else { // If there was not a valid period before, replace the current time period with the period after the event.
                            validTimes[i].start = newStart;
                        }
                    } else {
                        validAfter = false; // Else there is no valid time range after the event
                    }

                    if (!validBefore && !validAfter) { // No more valid times within this time range, remove this time range.
                        validTimes.splice(i, 1);
                    }
                } else if (validTimes[i].inRange(event.startTime)) { //          Event's start is contained within valid time range, but end is not
                    validTimes[i].end = moment(event.startTime).subtract(deadline.minBreak, 'minutes'); //     Change the valid time range's end to before the start of the event and a break
                } else if (validTimes[i].inRange(event.endTime)) { //            Event's end is contained within valid time range, but start is not
                    validTimes[i].start = moment(event.endTime).add(deadline.minBreak, 'minutes'); //     Change the valid time range's start to the end of the event and a break
                }
            }
        }
    }

    return validTimes;
}

/**
 * Takes a new deadline and a list of valid times and places new events for the deadline within the
 * valid times into a copy of the old schedule. Returns the copy.
 * @param {*} oldSchedule Event[] representing the current schedule.
 * @param {*} deadline    An instance of the deadline class.
*                            Interface Used:
 *                              - get deadline
 *                              - get totalDuration
 *                              - get minChildEventTime
 *                              - get maxChildEventTime
 *                              - get minBreak
 *                              - get startWorkTime
 *                              - get location
 * @param {*} givenValidTimes An array of valid time ranges for events to be scheduled in.
 */
function createEvents(oldSchedule, deadline, givenValidTimes) {
    let remainingTime = deadline.totalWorkTime;

    if (remainingTime < deadline.minChildEventTime) {
        return null;
    }

    const newSchedule = oldSchedule.slice(); // creates a copy of the old schedule
    const validTimes = new BinaryTimeRangeHeap(givenValidTimes);

    while (validTimes.length > 0 && remainingTime > 0) {
        const range = validTimes.pop(); // Get the longest duration TimeRange
        let duration = range.duration();

        // console.log(`validTimes.length: ${validTimes.length}`);
        // console.log(`remainingTime: ${remainingTime}`);
        // console.log(`duration: ${duration}`);
        // console.log(`Current Range: ${range.start.format('LLL')} to ${range.end.format('LLL')}`)

        // console.log('A');

        //                                                                                                      TODO: think about how to prevent ending up with remainingTime < minChildEventTime
        if (duration >= deadline.minEventTime) { // Time range is not too short
            // console.log('B');
            // Time range is larger than maximum child event duration.
            // Make new event with max child event time, add a new range into list.

            if (remainingTime < duration && remainingTime < deadline.maxEventTime) {
                duration = remainingTime;
            } else if (duration > deadline.maxEventTime) {
                // console.log('C');
                duration = deadline.maxEventTime;
                validTimes.push(new TimeRange(moment(range.start).add(deadline.maxEventTime + deadline.minBreak, 'minutes'), moment(range.end)));
            }
            // Else time range is less than maximum child event duration, take up entire range.

            // console.log('D');
            // Subtract duration of auto-scheduled event
            remainingTime -= duration;

            // If remaining time insufficient for another auto-scheduled event, reduce duration of
            // event currently being scheduled by the difference, so that another event
            // with the minimum child event time can be scheduled.
            if (remainingTime !== 0 && remainingTime < deadline.minEventTime) {
                // console.log('E');
                duration -= deadline.minEventTime - remainingTime;
                remainingTime = deadline.minEventTime;
            }

            // console.log('F');
            // console.log(`new remainingTime: ${remainingTime}`);
            // console.log(`new duration: ${duration}`);
            const debugEvent = new Event(deadline.name, deadline.description, moment(range.start),
                moment(range.start).add(duration, 'minutes'), deadline.location, false, deadline.notifications, deadline, ColorEnum.BLUE_BLACK);
            // console.log(`Added Event's start: ${debugEvent.startTime.format('LLL')}`);
            // console.log(`Added Event's end: ${debugEvent.endTime.format('LLL')}`);
            newSchedule.push(debugEvent);
            deadline.createdEvents.push(debugEvent);
        }
    }
    return newSchedule;
}

/**
 * Takes a new deadline and creates child events in the given schedule.
 * @param {*} oldSchedule     Event[] representing the current schedule.
 * @param {*} deadline        An instance of the deadline class.
 *                            Interface Used:
 *                              - get deadline
 *                              - get totalDuration
 *                              - get minChildEventTime
 *                              - get maxChildEventTime
 *                              - get minBreak
 *                              - get startWorkTime
 *                              - get location
 * @param {*} workHoursStart  Moment object for time of day user can work after.
 * @param {*} workHoursFin    Moment object for time of day user cannot work after.
 */
function autoSchedule(oldSchedule, deadline, workHoursStart, workHoursFin) {
    const oldVals = Object.values(oldSchedule);
    const validTimes = getValidTimes(oldVals, deadline, workHoursStart, workHoursFin);
    return createEvents(oldVals, deadline, validTimes);
}

export default autoSchedule;
export { getValidTimes };
export { createEvents };
export { TimeRange };
