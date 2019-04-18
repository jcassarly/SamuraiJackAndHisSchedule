/* eslint-disable */
/* eslint max-len: 0 */
import moment from 'moment-timezone'; // eslint-disable-line
import { Event } from './Event';
import ColorEnum from '../components/ColorEnum';

/*  Constants for TimeRange relations: 
    Details on what they mean in the header comments of inRelationTo function */
const BEFORE          = -2;
const OVERLAP_BEFORE  = -1;
const CONTAINS        = 0;
const CONTAINED       = 1;
const OVERLAP_AFTER   = 2;
const AFTER           = 3;

/**
 * Represents a range of time.
 */
class TimeRange {
    constructor(newStart, newEnd) {
        this._start = newStart;
        this._end = newEnd;
        this.start = newStart;
        this.end = newEnd;
    }

    get start() {
        return this._start;
    }

    get end() {
        return this._end;
    }

    static get BEFORE() {
        return BEFORE;
    }

    static get OVERLAP_BEFORE() {
        return OVERLAP_BEFORE;
    }

    static get CONTAINS() {
        return CONTAINS;
    }

    static get CONTAINED() {
        return CONTAINED;
    }

    static get OVERLAP_AFTER() {
        return OVERLAP_AFTER;
    }

    static get AFTER() {
        return AFTER;
    }

    set start(newStart) {
        if (newStart.isAfter(this.end)) {
            this._start = moment(this.end);
        } else {
            this._start = moment(newStart);
        }
    }

    set end(newEnd) {
        if (newEnd.isBefore(this.start)) {
            this._end = moment(this.start);
        } else {
            this._end = moment(newEnd);
        }
    }

    /**
     * Returns true if given moment is within this range, false if not
     * @param {*} time
     */
    inRange(time) {
        return ((this.start.isBefore(time) || this.start.isSame(time)) && 
                (this.end.isAfter(time)    || this.end.isSame(time))); // Use moment().format('x') to get time in Unix time (seconds since 1970)
    }

    /**
     * Returns the duration of this event in minutes
     */
    duration() {
        return (this.end.format('x') - this.start.format('x')) / 60 / 1000;
    }

    /**
     *  Returns:
     *      TimeRange.BEFORE         - this TimeRange is before the given TimeRange
     *      TimeRange.OVERLAP_BEFORE - this TimeRange begins before and ends during given TimeRange
     *      TimeRange.CONTAINED      - this TimeRange is contained within the given TimeRange
     *      TimeRange.CONTAINS       - this TimeRange contains the given TimeRange
     *      TimeRange.OVERLAP_AFTER  - this TimeRange begins during and ends after given TimeRange
     *      TimeRange.AFTER          - this TimeRange is after the given TimeRange.
     * @param {*} range
     */
    inRelationTo(range) {
        let returnValue;
        const endInRange   = range.inRange(this.end); // If this range's end is within given range
        const startInRange = range.inRange(this.start); // If this range's start is within given range
        if (this.end.isBefore(range.start)) { // If this range ends before given range begins
            returnValue = BEFORE;
        } else if (this.start.isBefore(range.start) && endInRange) { // If this range ends before but runs into given range.
            returnValue = OVERLAP_BEFORE;
        } else if (startInRange && endInRange) { // If this range is contained within the given range
            returnValue = CONTAINED;
        } else if (this.inRange(range.start) && this.inRange(range.end)) { // If this range contains the given range.
            returnValue = CONTAINS;
        } else if (startInRange && this.end.isAfter(range.end)) { // If this range begins during and continues after given range.
            returnValue = OVERLAP_AFTER;
        } else { // If this range occurs after the given range.
            returnValue = AFTER;
        }
        return returnValue;
    }

    /**
     * Splits this range using the given range and buffer so that there is no overlap.
     * Returns a list of the resulting ranges. Invalid events have 0 duration, but will still be added to the list.
     * Returns empty list if it's not possible to split this range.
     * @param {*} range
     * @param {*} buffer
     */
    trim(range, buffer) {
        let newRanges = [];
        const relation = this.inRelationTo(range);
        
        if (relation == OVERLAP_BEFORE || relation == CONTAINS){
            newRanges.push(new TimeRange(moment(this.start), moment(range.start).subtract(Number(buffer), 'minutes')));
        }
        
        if (relation == OVERLAP_AFTER || relation == CONTAINS) {
            newRanges.push(new TimeRange(moment(range.end).add(Number(buffer), 'minutes'), moment(this.end)));
        }
        
        return newRanges();
    }
}

/**
 * A heap data structure that stores time ranges and places the longest duration range on top
 */
class BinaryTimeRangeHeap {
    constructor(array) {
        this.array = [];
        this.array = array;
        this.heapify();
    }

    /**
     * Move the specified element up the heap
     * @param {*} givenIndex
     */
    siftUp(givenIndex) {
        let index = givenIndex;
        if (index > 0 && index < this.array.length) {
            while (index > 0) {
                const parent = Math.floor((index - 1) / 2);
                // If this node is longer than its parent, swap places.
                if (this.array[index].duration() > this.array[parent].duration()) {
                    const temp = this.array[index];
                    this.array[index] = this.array[parent];
                    this.array[parent] = temp;
                }
                index = parent;
            }
        }
    }

    /**
     * Move the specified element down the heap
     * @param {*} givenIndex
     */
    siftDown(givenIndex) {
        let index = givenIndex;
        if (index >= 0 && index < this.array.length) {
            while (index < Math.floor(this.array.length / 2)) {
                const leftChild = 2 * index + 1;
                const rightChild = 2 * index + 2;
                let largerChild;

                // Compare children, find the larger one
                if (rightChild < this.array.length &&
                    this.array[leftChild].duration() < this.array[rightChild].duration()) {
                    largerChild = rightChild;
                } else {
                    largerChild = leftChild;
                }

                // If the larger child is larger than this node, swap places
                if (this.array[largerChild].duration() > this.array[index].duration()) {
                    const temp = this.array[index];
                    this.array[index] = this.array[largerChild];
                    this.array[largerChild] = temp;
                }
                index = largerChild;
            }
        }
    }

    /**
     * Convert the array in to a heap data structure
     */
    heapify() {
        for (let i = this.array.length - 1; i >= 0; i -= 1) {
            this.siftUp(i);
        }
    }

    /**
     * Add a new timerange to the heap
     * @param {*} newRange
     */
    push(newRange) {
        this.array.push(newRange); // Add the new timerange to the this.array
        this.siftUp(this.array.length - 1); // Sift the new timerange up
    }

    /**
     * Remove the longest time range in the heap
     */
    pop() {
        const returnValue = this.array.shift(); // Save the first range in the this.array (longest duration)
        if (this.array.length > 0){
            this.array.unshift(this.array.pop()); // Move the last range in the this.array to the top
            this.siftDown(0); // Sift the new top down
        }
        return returnValue; // return the original top of the heap
    }

    /**
     * Get the number of timeranges in the heap
     */
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
    // The valid timerange events can be within
    const workRange = new TimeRange(deadline.startWorkTime, deadline.deadline);

    // Debugging console outputs
    console.log('Deadline Parameters' +
                `\n    MinEventTime: ${deadline.minEventTime}` +
                `\n    MaxEventTime: ${deadline.maxEventTime}` +
                `\n    MinBreakTime: ${deadline.minBreak}` +
                `\n    TotalWorkTime: ${deadline.totalWorkTime}` +
                `\n    Start Work: ${deadline.startWorkTime.utc()}` +
                `\n    end Work: ${deadline.deadline.utc()}` +
                `\n    workHoursStart: ${workHoursStart.utc()}` +
                `\n    workHoursEnd: ${workHoursFin.utc()}`)
    // printRanges(eventToRanges(oldSchedule));

    // eslint-disable-next-line prefer-const
    let validTimes = [];

    // Used for setting the start of a valid time range of a day
    const dailyStart = moment(deadline.startWorkTime).hour(workHoursStart.hour()).minute(workHoursStart.minute());
    // Used as the start of the added time ranges
    let start = moment(moment.max(deadline.startWorkTime, dailyStart));
    // The end of a valid time range during a day
    const dailyEnd = moment(deadline.startWorkTime).hour(workHoursFin.hour()).minute(workHoursFin.minute());
    // The deadline
    const finalEnd = moment(moment.min(deadline.deadline, moment(deadline.deadline).hour(workHoursFin.hour()).minute(workHoursFin.minute())));

    // Debugging console outputs
    console.log(`Initial Values` +
                `\n    dailyStart: ${dailyStart.utc()}` +
                `\n    start: ${start.utc()}` +
                `\n    dailyEnd: ${dailyEnd.utc()}` +
                `\n    finalEnd: ${finalEnd.utc()}`)

    // Accounting for if the given start time is after specified working hours
    if (start.isAfter(dailyEnd)) {
        start = moment(dailyStart.add(1, 'days'));
        dailyEnd.add(1, 'days');
    }

    // Add Valid time ranges during the day
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
                validTimes[i].trim(new TimeRange(moment(event.startTime), moment(event.endTime)), deadline.minBreak);

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

    // Sanity checkign the parameters
    if (remainingTime < deadline.minChildEventTime) {
        throw "Auto Schedule unable to schedule: Initial Total Work time less than minimum event time."
    }

    const newSchedule = oldSchedule.slice(); // creates a copy of the old schedule
    const validTimes = new BinaryTimeRangeHeap(givenValidTimes); // Use Binary Heap data structure
    let counter = 0; // For debugging purposes if the loop goes infinite

    while (validTimes.length > 0 && remainingTime > 0) {
        // Just in case the loop goes infinite. For debuggint purposes
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

        // Time range is not too short
        if (duration >= deadline.minEventTime) {

            // If remaining time can fit into this time range
            if (remainingTime < duration && remainingTime < Number(deadline.maxEventTime)) {
                duration = remainingTime;
            } else if (duration > deadline.maxEventTime) { // Time range is larger than maximum child event duration.
                // Use the maximum event time as duration
                duration = deadline.maxEventTime;

                // Re-add the remaining time in this range
                const newStart = moment(range.start).add(Number(deadline.maxEventTime) + Number(deadline.minBreak), 'm');
                const newDuration = (range.end.format('x') - newStart.format('x')) / 60 / 1000;
                if (newDuration > deadline.minEventTime) {
                    validTimes.push(new TimeRange(newStart, moment(range.end)));
                }
            }
            // Else time range is less than maximum child event duration, take up entire range.


            // Subtract duration of auto-scheduled event
            remainingTime -= duration;

            // If remaining time insufficient for another auto-scheduled event, reduce duration of
            // event currently being scheduled by the difference, so that another event
            // with the minimum child event time can be scheduled.
            if (remainingTime !== 0 && remainingTime < deadline.minEventTime) {
                duration -= deadline.minEventTime - remainingTime;
                remainingTime = deadline.minEventTime;
            }

            // Create a new event with the specified duration
            const debugEvent = new Event(deadline.name, deadline.description, moment(range.start),
                moment(range.start).add(duration, 'minutes'), deadline.location, false, deadline.notifications, deadline, ColorEnum.BLUE_BLACK);
            // console.log(`Added Event's start: ${debugEvent.startTime.format('LLL')}`);
            // console.log(`Added Event's end: ${debugEvent.endTime.format('LLL')}`);


            // Add event to the scheudle and the deadline's list of child events
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
    // Debugging console
    console.log('Deadline Parameters')
    console.log(`    MinEventTime: ${deadline.minEventTime}`)
    console.log(`    MaxEventTime: ${deadline.maxEventTime}`)
    console.log(`    MinBreakTime: ${deadline.minBreak}`)
    console.log(`    TotalWorkTime: ${deadline.totalWorkTime}`)

    // Create a list of just the events from the old schdule
    const oldVals = Object.values(oldSchedule);

    // Debugging console outputs
    console.log('Currently existing Events')
    printRanges(eventToRanges(oldVals))

    // Get valid time ranges the function can place events within
    const validTimes = getValidTimes(oldVals, deadline, workHoursStart, workHoursFin);

    // Debugging console outputs
    console.log('Values of ValidTimes after getValidTimes():')
    printRanges(validTimes);
    console.log('Types of validTimes after getValidTimes():');
    console.log(validTimes);

    // Create a new schedule with events for this deadline
    let returnvalue =  createEvents(oldVals, deadline, validTimes);

    // debugging console outputs
    console.log('Events:')
    printRanges(eventToRanges(returnvalue));

    // Return teh new schedule (will be merged with createEvents line w/o debugging)
    return returnvalue;
}

/**
 * A function for debugging lists of time ranges
 * @param {*} ranges
 */
function printRanges(ranges) {
    let acc = 'Printing Ranges:\n';
    for (let j = 0; j < ranges.length; j += 1) {
        acc = acc + `    Range: ${j}\n    Start: ${ranges[j].start.utc()}\n    End: ${ranges[j].end.utc()}\n    Duration: ${ranges[j].duration()}\n\n`;
    }
    console.log(acc);
}

/**
 * A function for debugging event lists
 * @param {*} schedule
 */
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
export { printRanges };
export { eventToRanges };
