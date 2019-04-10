/* eslint-disable */
/* eslint max-len: 0 */
import moment from 'moment-timezone'; // eslint-disable-line
import { Event } from './Event';

const TimeRangeRelation = {
    BEFORE: -1,
    OVERLAP: 0,
    AFTER: 1,
}

/**
 * Represents a range of time.
 */
class TimeRange {
    constructor(start, end) {
        this._start = start;
        this._end = end;
        this.start = start;
        this.end = end;
    }

    get start() {
        return this._start;
    }

    get end() {
        return this._end;
    }

    set start(newStart) {
        if (newStart.isAfter(this.end)) {
            throw 'Invalid TimeRange: start cannot be after end'
        } else {
            this._start = moment(newStart);
        }
    }

    set end(newEnd) {
        if (newEnd.isBefore(this.start)) {
            throw 'Invalid TimeRange: end cannot be before start'
        } else {
            this._end = moment(newEnd);
        }
    }

    inRange(time) {
        return (this.start.isBefore(time) && this.end.isAfter(time)); // Use moment().format('x') to get time in Unix time (seconds since 1970)
    }

    duration() {
        return (this.end.format('x') - this.start.format('x')) / 60 / 1000;
    }

    /**
     * Returns:
     *      -1 this TimeRange is before the given TimeRange
     *       0 this TimeRange overlaps with given TimeRange
     *       1 this TimeRange is after the given TimeRange
     * @param {*} range 
     */
    inRelationTo(range) {
        let returnValue;
        if (this.end.isBefore(range.start)) {
            returnValue = -1;
        } else if (range.inRange(this.start) || range.inRange(this.end)) {
            returnValue = 0;
        } else {
            returnValue = 1;
        }
        return returnValue;
    }

    trim(range, breakTime) {
        // timerange's start time is within the given range, move it to after the range's end
        if (range.inRange(this.start)) { 
            this.start = moment(range.end).add(Number(breakTime), 'minutes');
        } 

        // timerange's end time is within given range, move it to before range starts 
        if (range.inRange(this.end)) {
            this.end = moment(range.start).subtract(Number(breakTime), 'minutes');
        }
    }
}

class BinaryTimeRangeHeap {
    constructor(array) {
        this.array = array;
        this.heapify();
    }

    siftUp(givenIndex) {
        let index = givenIndex;
        if (index > 0 && index < this.array.length) {
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
                const leftChild = 2 * index + 1;
                const rightChild = 2 * index + 2;
                let largerChild;

                if (rightChild < this.array.length && 
                    this.array[leftChild].duration() < this.array[rightChild].duration()) {
                    largerChild = rightChild;
                } else {
                    largerChild = leftChild;
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
        console.log(this.array);
        this.siftUp(this.array.length - 1); // Sift the new timerange up
    }

    pop() {
        const returnValue = this.array.shift(); // Save the first range in the this.array (longest duration)
        if (this.array.length > 0){
            this.array.unshift(this.array.pop()); // Move the last range in the this.array to the top
            this.siftDown(0); // Sift the new top down
        }
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
    while (start.isBefore(finalEnd)) {
        validTimes.push(new TimeRange(moment(start), moment(moment.min(dailyEnd, finalEnd))));
        start = dailyStart.add(1, 'days');
        dailyEnd.add(1, 'days'), finalEnd;
    }

    // Iterates through the schedule and gets valid times to schedule new events
    // Currently assuming the events are sorted chronologically and do not overlap
    //                                                                                                    TODO: Account for non-chronological and overlapping events
    for (let j = 0; j < oldSchedule.length; j += 1) {
        const event = oldSchedule[j];
        if (workRange.inRange(event.startTime) || workRange.inRange(event.endTime)) {
            /* Check if the event overlaps with a currently valid time range */
            //                                                                                            TODO: Find a more efficient method to do this.
            for (let i = validTimes.length - 1; i >= 0; i -= 1) {

                // If the event slightly overlaps the beginning or end of this time range, trim the edges
                validtimes[i].trim(TimeRange(moment(event.startTime), moment(event.endtime)), deadline.minBreak);

                if (validTimes[i].inRange(event.startTime) && validTimes[i].inRange(event.endTime)) { // The event is contained within a valid time range, split into two separate time ranges before and after
                    const prevEnd = moment(validTimes[i].end);

                    let validBefore = true;
                    const newEnd = moment(event.startTime).subtract(Number(deadline.minBreak), 'minutes');
                    if (validTimes[i].start.isBefore(newEnd)) { // If there is a valid period before the event
                        validTimes[i].end = moment(newEnd); // Change the valid time range's end to before the start of the event and a break
                    } else {
                        validBefore = false; // Else there is no valid time range before the event
                    }

                    let validAfter = true;
                    const newStart = moment(event.endTime).add(Number(deadline.minBreak), 'minutes');

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
    let counter = 0;

    console.log('Values of validTimes before loop');
    printRanges(validTimes.array);

    while (validTimes.length > 0 && remainingTime > 0) {
        counter += 1;
        if (counter > 100) {
            console.log(`Exceeded 100 iterations.`);
            console.log('Types of validTimes during infinite:');
            console.log(validTimes);
            console.log('Values of validTimes during infinite:')
            printRanges(validTimes.array);
            break;
        }
        const range = validTimes.pop(); // Get the longest duration TimeRange
        let duration = range.duration();

        // console.log(`validTimes.length: ${validTimes.length}`);
        // console.log(`remainingTime: ${remainingTime}`);
        // console.log(`duration: ${duration}`);
        console.log(`Current Range: ${range.start.format('LLL')} to ${range.end.format('LLL')}`)

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

                const newStart = moment(range.start).add(Number(deadline.maxEventTime) + Number(deadline.minBreak), 'm');
                const newDuration = (range.end.format('x') - newStart.format('x')) / 60 / 1000;
                console.log(`newDuration: ${newDuration}`);
                if (newDuration > deadline.minEventTime) {
                    console.log('Added new timerange')
                    validTimes.push(new TimeRange(newStart, moment(range.end)));
                }
                console.log('ValidTimes post split:')
                printRanges(validTimes.array);

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
                moment(range.start).add(Number(duration), 'minutes'), deadline.location, false, deadline.notifications, deadline);
            // console.log(`Added Event's start: ${debugEvent.startTime.format('LLL')}`);
            // console.log(`Added Event's end: ${debugEvent.endTime.format('LLL')}`);
            newSchedule.push(debugEvent);
            deadline.createdEvents.push(debugEvent);
        } else {
            throw "Auto Scheduler unable to schedule: No more valid time ranges longer than min event time."
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
    console.log('yeee yee wassup');
    console.log('Values of ValidTimes after getValidTimes():')
    printRanges(validTimes);
    console.log('Types of validTimes after getValidTimes():');
    console.log(validTimes);
    let returnvalue =  createEvents(oldVals, deadline, validTimes);
    console.log('Events:')
    printRanges(eventToRanges(returnvalue));
    return returnvalue;
}

function printRanges(ranges) {
    for (let j = 0; j < ranges.length; j += 1) {
        console.log(`Range: ${j}\n    Start: ${ranges[j].start.format('MMMM Do YYYY, h:mm:ss a')}\n    End: ${ranges[j].end.format('MMMM Do YYYY, h:mm:ss a')}`);
    }
}

function eventToRanges(schedule) {
    let newSchedule = Object.values(schedule);
    let newRanges = [];
    for (let j = 0; j < schedule.length; j += 1) {
        newRanges.push(new TimeRange(newSchedule[j].startTime, newSchedule[j].endTime));
    }
    return newRanges;
}

export default autoSchedule;
export { getValidTimes };
export { createEvents };
export { TimeRange };
