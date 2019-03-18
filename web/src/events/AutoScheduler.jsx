import Event from './Event';
import moment from 'moment-timezone';

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
        return (this.start.format('x') <= time.format('x') && this.end.format('x') >= time.format('x')); // Use moment().format('x') to get time in Unix time (seconds since 1970)
    }

    duration() {
        return this.end.format('x') - this.start.format('x');
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
 *                              - get breakTime
 *                              - get startWorkTime
 * @param {*} workHoursStart  Moment object for time of day user can work after.
 * @param {*} workHoursFin    Moment object for time of day user cannot work after.
 */
function getValidTimes(oldSchedule, deadline, workHoursStart, workHoursFin) {
    const workRange = new TimeRange(deadline.startWorkTime, deadline.deadline);
    // eslint-disable-next-line prefer-const
    let validTimes = [workRange];
                                                                                                                // TODO: split initial work Range into work times per day based on workHoursStart and workHoursFin

    // Iterates through the schedule and gets valid times to schedule new events
    // Currently assuming the events are sorted chronologically and do not overlap
                                                                                                            // TODO: Account for non-chronological and overlapping events
    for (let j = 0; j < oldSchedule.length; j += 1) {
        const event = oldSchedule[j];
        if (workRange.inRange(event.startTime) || workRange.inRange(event.endTime)) {

            /* Check if the event overlaps with a currently valid time range */
                                                                                                                // TODO: Find a more efficient method to do this.
            // let overlap = false;
            for (let i = validTimes.length - 1; i >= 0; i -= 1) {

                if (validTimes[i].inRange(event.startTime) && validTimes[i].inRange(event.endTime)) { // The event is contained within a valid time range, split into two separate time ranges before and after
                    const prevEnd = validTimes[i].end;

                    let validBefore = true;
                    const newEnd = moment((Number(event.startTime.format('x')) - deadline.breakTime).toString(), 'x');
                    if (Number(newEnd.format('x')) > Number(validTimes[i].start.format('x'))) { // If there is a valid period before the event
                        validTimes[i].end = newEnd; // Change the valid time range's end to before the start of the event and a break
                    } else {
                        validBefore = false; // Else there is no valid time range before the event
                    }

                    let validAfter = true;
                    const newStart = moment((Number(event.endTime.format('x')) + deadline.breakTime).toString(), 'x');
                    if (Number(newStart.format('x')) < Number(validTimes[i].end.format('x'))) { // If there is a valid period after the event
                        if (validBefore) { // If there was a valid period before, insert a new time period afer the event
                            validTimes.splice(i + 1, 0, new TimeRange(newStart, prevEnd));
                        } else { // If there was not a valid period before, replace the current time period with the period after the event.
                            validTimes[i].start = newStart;
                        }
                    } else {
                        validAfter = false; // Else there is no valid time range after the event
                    }

                    if (!validBefore && !validAfter) { // No more valid times within this time range, remove this time range.
                        validTimes.splice(i, 1);
                    }
                } else if (validTimes[i].inRange(event.startTime)) {          // Event's start is contained within valid time range, but end is not
                    validTimes[i].end = moment((Number(event.startTime.format('x')) - deadline.breakTime).toString(), 'x'); //     Change the valid time range's end to before the start of the event and a break
                } else if (validTimes[i].inRange(event.endTime)) {            // Event's end is contained within valid time range, but start is not
                    validTimes[i].start = moment((Number(event.endTime.format('x')) + deadline.breakTime).toString(), 'x'); //     Change the valid time range's start to the end of the event and a break
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
 *                              - get breakTime
 *                              - get startWorkTime
 *                              - get location
 * @param {*} givenValidTimes An array of valid time ranges for events to be scheduled in.
 */
function createEvents(oldSchedule, deadline, givenValidTimes) {
    let remainingTime = deadline.totalDuration;

    if (remainingTime < deadline.minChildEventTime) {
        return null;
    }

    let newSchedule = oldSchedule.slice(); // creates a copy of the old schedule
    let validTimes = new BinaryTimeRangeHeap(givenValidTimes);

    while (validTimes.length > 0) {
        const range = validTimes.pop(); // Get the longest duration TimeRange
        let duration = range.duration();

                                                                                                             // TODO: think about how to prevent ending up with remainingTime < minChildEventTime
        if (duration > deadline.minChildEventTime) { // Time range is not too short
            // Time range is larger than maximum child event duration.
            // Make new event with max child event time, add a new range into list.
            if (duration > deadline.maxChildEventTime) {
                duration = deadline.maxChildEventTime;
                remainingTime -= deadline.maxC;
                validTimes.unshift(new TimeRange(range.start + deadline.maxChildEventTime
                    + deadline.breakTime, range.end));
            }
            // Else time range is less than maximum child event duration, take up entire range.

            // Subtract duration of auto-scheduled event
            remainingTime -= duration;

            // If remaining time insufficient for another auto-scheduled event, reduce duration of
            // event currently being scheduled by the difference, so that another event
            // with the minimum child event time can be scheduled.
            if (remainingTime < deadline.minChildEventTime) {
                duration -= deadline.minChildEventTime - remainingTime;
                remainingTime = deadline.minChildEventTime;
            }

            newSchedule.push(new Event(deadline.name, deadline.description, range.start,
                range.start + duration, deadline.location, false, deadline.notifications, deadline.parent));
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
 *                              - get breakTime
 *                              - get startWorkTime
 *                              - get location
 * @param {*} workHoursStart  Moment object for time of day user can work after.
 * @param {*} workHoursFin    Moment object for time of day user cannot work after.
 */
function autoSchedule(oldSchedule, deadline, workHoursStart, workHoursFin) {
    const oldVals = Object.values(oldSchedule);
    let validTimes = getValidTimes(oldVals, deadline, workHoursStart, workHoursFin);
    return createEvents(oldVals, deadline, validTimes);
}