/* eslint-disable */
/* eslint max-len: 0 */
import moment from 'moment-timezone'; // eslint-disable-line
import { Event, LocationEvent, RecurringEvent } from './Event';
import Frequency from './Frequency';
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
    split(range, buffer) {
        let newRanges = [];
        const relation = this.inRelationTo(range);

        if (relation == OVERLAP_BEFORE || relation == CONTAINS){
            newRanges.push(new TimeRange(moment(this.start), moment(range.start).subtract(Number(buffer), 'minutes')));
        }
        
        if (relation == OVERLAP_AFTER || relation == CONTAINS) {
            newRanges.push(new TimeRange(moment(range.end).add(Number(buffer), 'minutes'), moment(this.end)));
        }

        if (relation == BEFORE || relation == AFTER) {
            newRanges.push(this);
        }

        return newRanges;
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

    get totalTime() {
        let accumulator = 0;
        this.array.map(function(element) {
            accumulator += element.duration();
        });
        return accumulator;
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

    // eslint-disable-next-line prefer-const
    let validTimes = [];

    if (deadline.useLocation == true)
    {
        console.log('LocationEvents Ranges: ');
        printRanges(eventToRanges(oldSchedule))
        oldSchedule = oldSchedule.map(function(event) {
            if (event instanceof LocationEvent) {
                const newRange = new TimeRange(moment(event.startTime), moment(event.endTime));
                const workHoursRange = new TimeRange(moment(newRange.start).hour(workHoursStart.hour()).minute(workHoursStart.minute()),
                                                     moment(newRange.end).hour(workHoursFin.hour()).minute(workHoursFin.minute()));
                const workHoursRelation = newRange.inRelationTo(workHoursRange);

                // This location event starts before work hours
                if (workHoursRelation == TimeRange.OVERLAP_BEFORE || workHoursRelation == TimeRange.CONTAINS) {
                    newRange.start = moment(workHoursRange.start);
                }
                
                // This location event ends after work hours
                if (workHoursRelation == TimeRange.OVERLAP_AFTER || workHoursRelation == TimeRange.CONTAINS) {
                    newRange.end = moment(workHoursRange.end);
                }

                const workPeriod = new TimeRange(moment(deadline.startWorkTime), moment(deadline.deadline));
                const deadlineRelation = newRange.inRelationTo(workPeriod);
                if (deadlineRelation == TimeRange.OVERLAP_BEFORE || deadlineRelation == TimeRange.CONTAINS) {
                    newRange.start = moment(deadline.startWorkTime);
                }

                if (deadlineRelation == TimeRange.OVERLAP_AFTER || deadlineRelation == TimeRange.CONTAINS) {
                    newRange.end = moment(deadline.deadline);
                }

                // This location event overlaps at some point with work hours, can be added
                if (workHoursRelation != TimeRange.BEFORE && workHoursRelation != TimeRange.AFTER &&
                    deadlineRelation != TimeRange.BEFORE && deadlineRelation != TimeRange.AFTER) {
                    validTimes.push(newRange);
                }
            }
            return event;
        }).filter(event => (event instanceof LocationEvent) != true);
    }
    else {
        // Used for setting the start of a valid time range of a day
        const dailyStart = moment(deadline.startWorkTime).hour(workHoursStart.hour()).minute(workHoursStart.minute());
        // Used as the start of the added time ranges
        let start = moment(moment.max(deadline.startWorkTime, dailyStart));
        // The end of a valid time range during a day
        const dailyEnd = moment(deadline.startWorkTime).hour(workHoursFin.hour()).minute(workHoursFin.minute());
        // The deadline or end of working hours before deadline.
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
    }
    // Iterates through the schedule and gets valid times to schedule new events
    // Currently assuming the events are sorted chronologically and do not overlap
    //                                                                                                    TODO: Account for non-chronological and overlapping events
    oldSchedule.map(function(event) {        
        while (workRange.inRange(event.startTime) || workRange.inRange(event.endTime)) {
            /* Check if the event overlaps with a currently valid time range */
            //                                                                                            TODO: Find a more efficient method to do this.
            let newRanges = []
            validTimes.map(function(validTime) {
                let splitRanges = validTime.split(new TimeRange(moment(event.startTime), moment(event.endTime)), deadline.minBreak); // Get a list of ranges split by event
                splitRanges = splitRanges.filter(element => element.duration() > deadline.minEventTime); // remove all ranges shorter than minEventTime
                newRanges = newRanges.concat(splitRanges);
            })
            validTimes = newRanges;

            if (event instanceof RecurringEvent) {
                switch(event.frequency.timing) {
                    case Frequency.freqEnum.DAILY:
                        event.startTime.add(1, 'days');
                        event.endTime.add(1, 'days');
                        break;
                    case Frequency.freqEnum.WEEKLY:
                        event.startTime.add(7, 'days');
                        event.endTime.add(7, 'days');
                        break;
                    case Frequency.freqEnum.MONTHLY:
                        event.startTime.add(1, 'months');
                        event.endTime.add(1, 'months');
                        break;
                    case Frequency.freqEnum.YEARLY:
                        event.startTime.add(1, 'years');
                        event.endTime.add(1, 'years');
                        break;
                    default:
                        throw 'Auto Scheduler unable to schedule: Invalid Frequency.'
                }
            } else {
                break; // It's just a normal event, just gotta execute code above once.
            }
        }
    });

    return validTimes;
}

/**
 * Takes a deadline and returns a list of integers representing the durations of events of events
 * that will get the fewest number of breaks, assuming there are valid ranges to accommodate them.
 * @param {*} totalWorkTime 
 * @param {*} minEventTime
 * @param {*} maxEventTime
 */
function getOptimalDurations(totalWorkTime, minEventTime, maxEventTime) {
    const nMax = Math.floor(totalWorkTime / maxEventTime);
    let remainder = totalWorkTime % maxEventTime;
    const eventDurations = [];
    for (let i = 0; i < nMax; i += 1) {
        eventDurations.push(maxEventTime);
    }
    let index = eventDurations.length - 1;
    while (remainder < minEventTime && index >= 0) {
        const remainderDiff = minEventTime - remainder; // The amount of time to be stolen from other event durations
        // Find how much time the current event duration can spare. RemainderDiff vs. Max amount before duration = minEventTime
        const spareTime = Math.min(remainderDiff, eventDurations[index] - minEventTime);
        remainder += spareTime;
        eventDurations[index] -= spareTime;
        index -= 1;
    }
    if (remainder < minEventTime) {
        throw "Auto Scheduler unable to Schedule: Something went horribly wrong :("
    }
    eventDurations.push(remainder); // At this point, remainder == minEventTime

    return eventDurations;
}

/**
 * Takes a new deadline and a list of valid times and places new events for the deadline within the
 * valid times into a copy of the old schedule. Returns the copy.
 * @param {*} oldSchedule Event[] representing the current schedule.
 * @param {*} deadline    An instance of the deadline class.
*                            Interface Used:
 *                              - get deadline
 *                              - get totalWorkTime
 *                              - get minEventTime
 *                              - get maxEventTime
 *                              - get minBreak
 *                              - get startWorkTime
 *                              - get location
 * @param {*} givenValidTimes An array of valid time ranges for events to be scheduled in.
 */
function createEvents(oldSchedule, deadline, givenValidTimes) {

    const validTimes = new BinaryTimeRangeHeap(givenValidTimes); // Use Binary Heap data structure
    let totalValidTime = validTimes.totalTime;

    // Sanity checking the parameters
    if (deadline.totalWorkTime < deadline.minEventTime) {
        throw "Auto Scheduler unable to schedule: Initial Total Work time less than minimum event time."
    } else if (totalValidTime < deadline.totalWorkTime) {
        throw "Auto Scheduler unable to schedule: Insufficient valid working time."
    }

    const newSchedule = oldSchedule.slice(); // creates a copy of the old schedule    
    
    /** Step 1: Get the optimal event durations to get the fewest number of breaks */
    //          List is assumed to be ordered from longest to shortest
    let optimalDurations = getOptimalDurations(deadline.totalWorkTime, deadline.minEventTime, deadline.maxEventTime);

    /** Step 2: Put Events into valid ranges */
    let remainingTime = deadline.totalWorkTime;
    while(validTimes.length > 0 && optimalDurations.length > 0) {
        const range = validTimes.pop();
        const rangeDuration = range.duration();

        // If the largest optimal duration is longer than the largest valid duration, 
        // Recreate the optimal list to accomodate the new maximum
        if (optimalDurations[0] > rangeDuration) {
            optimalDurations = getOptimalDurations(remainingTime, deadline.minEventTime, rangeDuration);
        }

        let index = 0;
        // TODO: gotta work on this conditional right here
        if (rangeDuration > optimalDurations[index]) {

            /* If the following are satisfied, then try a smaller optimal duration:
             * 1) The current optimal duration will not leave enough time for another event in this time range
             * 2) The sum of the other valid ranges will not contain the remaining time.
             */
            while (rangeDuration - optimalDurations[index] - deadline.minEventTime < deadline.minEventTime && 
                   totalValidTime - rangeDuration < remainingTime - optimalDurations[index] && 
                   index < optimalDurations.length) {
                index += 1;
            }

            if (index == optimalDurations.length) {
                throw "Auto Scheduler unable to schedule: Given min and max event times will not fit within valid times."
            }
            
            let splitRanges = range.split(new TimeRange(moment(range.start), moment(range.start).add(optimalDurations[index], 'minutes')), deadline.minBreak);
            splitRanges = splitRanges.filter(element => element.duration() > deadline.minEventTime)
            splitRanges.map(element => validTimes.push(element));
        }

        // Create a new event with the specified duration
        const debugEvent = new Event(deadline.name, deadline.description, moment(range.start),
            moment(range.start).add(optimalDurations[index], 'minutes'), deadline.location, false, deadline.notifications, deadline, ColorEnum.BLUE_BLACK);

        // Add event to the scheudle and the deadline's list of child events
        newSchedule.push(debugEvent);
        deadline.createdEvents.push(debugEvent);

        // Setup for the next iteration
        remainingTime -= optimalDurations[index];
        totalValidTime -= optimalDurations[index] - deadline.minEventTime;
        optimalDurations.splice(index, 1);
    }

    if (optimalDurations.length > 0) {
        throw "Auto Scheduler unable to schedule: Could not find a valid schedule with given parameters";
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
 *                              - get minEventTime
 *                              - get maxChildEventTime
 *                              - get minBreak
 *                              - get startWorkTime
 *                              - get location
 * @param {*} workHoursStart  Moment object for time of day user can work after.
 * @param {*} workHoursFin    Moment object for time of day user cannot work after.
 */
function autoSchedule(oldSchedule, deadline, workHoursStart, workHoursFin) {
    console.log('Deadline Parameters' +
        `\n    MinEventTime: ${deadline.minEventTime}` +
        `\n    MaxEventTime: ${deadline.maxEventTime}` +
        `\n    MinBreakTime: ${deadline.minBreak}` +
        `\n    TotalWorkTime: ${deadline.totalWorkTime}` +
        `\n    Start Work: ${deadline.startWorkTime.utc()}` +
        `\n    end Work: ${deadline.deadline.utc()}` +
        `\n    workHoursStart: ${workHoursStart.utc()}` +
        `\n    workHoursEnd: ${workHoursFin.utc()}`)

    // Create a list of just the events from the old schdule
    const oldVals = Object.values(oldSchedule);

    // Debugging console outputs
    console.log('Currently existing Events')
    printRanges(eventToRanges(oldVals))

    // Get valid time ranges the function can place events within
    const validTimes = getValidTimes(oldVals, deadline, workHoursStart, workHoursFin);

    // Create a new schedule with events for this deadline
    let returnvalue =  createEvents(oldVals, deadline, validTimes);

    // debugging console outputs
    console.log('New Schedule:')
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
export { getOptimalDurations };