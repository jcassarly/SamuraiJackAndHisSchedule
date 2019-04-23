import moment from 'moment';
import { CREATE_EVENT, CREATE_DEADLINE_EVENT } from '../actions/createEvent';
import { MOVE_EVENT, CHANGE_START, CHANGE_END } from '../actions/changeEvent';
import {
    CUT,
    COPY,
    PASTE,
    SET_DAY,
} from '../actions/clipboard';
import { SYNC_FROM } from '../actions/sync';
import autoSchedule from '../events/AutoScheduler';
import { deserialize } from '../events/Event';
import { deserializeDeadline } from '../events/Deadline';
import { loadState } from './persistState';

// the user starts out with no events
// each event needs an id, these ids are assigned in order, maxId keeps track of the largest
const initialState = loadState().events;

/**
 * Deserializes the JSON objects that are in the elements of the parsed objects passed in
 * @param {*} events    a JSON object containing events n JSON strings in the form:
 *                      {events: {
 *                              0: <Event object JSON string>,
 *                              1: <Event object JSON string>,
 *                              ...
 *                              n: <Event object JSON string>,
 *                          }
 *                      }
 * @param {*} deadlines a JSON object containing deadlines JSON strings int he form
 *                      {deadlines: {
 *                              0: <Deadline object JSON string>,
 *                              1: <Deadline object JSON string>,
 *                              ...
 *                              n: <Deadline object JSON string>,
 *                          }
 *                      }
 */
function deserializeSyncPayload(events, deadlines) {
    // deserialize the deadlines
    const newDeadlines = {};
    Object.keys(deadlines).forEach((key) => {
        // get the deadline from the response
        newDeadlines[key] = deserializeDeadline(deadlines[key]);

        // set the id of the current deadline
        newDeadlines[key].id = key;
    });

    // deserialize the events
    const newEvents = {};
    let largestKey = 0;
    Object.keys(events).forEach((key) => {
        if (key > largestKey) {
            largestKey = key;
        }
        // get the event from the response
        newEvents[key] = deserialize(events[key]);

        // set the id of the current event
        newEvents[key].id = key;

        // need to check if the current event has a parent
        if (newEvents[key].parent !== -1) {
            // get the pointer to the parent deadline class
            newEvents[key].parent = newDeadlines[newEvents[key].parent];

            // set the child event in the parent to the current event
            // after all iterations, the child events in the deadline class will
            // be set up correctly with circular references
            newEvents[key].parent.setEvent(key, newEvents[key]);
        // set parent to null if there is none - the -1 is only for serialization
        } else {
            newEvents[key].parent = null;
        }
    });

    return {
        events: newEvents,
        maxEventId: largestKey + 1,
        deadlines: newDeadlines,
        maxDeadlineId: Object.values(newDeadlines).length,
        clipboard: null,
    };
}

/**
 * Serializes the the lists of events and deadlines along with the settings
 * serialized objects are put into an object that is then stringified:
 *
 * @param {*} events the list of events to serialized
 * @param {*} deadlines the list of deadlines to serialize
 * @param {*} settings the settings object to serialize
 *
 * Returns an object in the form:
 * {
 *     events:    <serialized list of events>
 *     deadliens: <serialized list of deadlines>
 *     settings:  <serialized settings>
 * }
 */
function serializeSyncPayload(events, deadlines, settings) {
    // serialize the events
    const eventsClone = {};
    Object.keys(events).forEach((key) => {
        eventsClone[key] = JSON.stringify(events[key].serialize());
    });

    // serialize the deadlines
    const deadlinesClone = {};
    Object.keys(deadlines).forEach((key) => {
        deadlinesClone[key] = JSON.stringify(deadlines[key].serialize());
    });

    // takes the serialized lists and settings and combine them into one object
    return JSON.stringify({
        events: JSON.stringify(eventsClone),
        deadlines: JSON.stringify(deadlinesClone),
        settings: JSON.stringify(settings.serialize()),
    });
}

/**
 * reducer for the list of all events the user has
 */
const reducer = (state = initialState, action) => {
    // copy the old state
    let newState = { ...state };
    newState.events = { ...state.events };
    newState.deadlines = { ...state.deadlines };

    if (action) {
        // mutate state depending on the type of the action
        switch (action.type) {
        // adds a new event
        case CREATE_EVENT:
            // adds a new event with an id corresponding to max id
            newState.events[state.maxEventId] = action.payload.event;
            newState.events[state.maxEventId].id = state.maxEventId;
            newState.maxEventId = state.maxEventId + 1;
            break;

        // adds a new deadline event
        case CREATE_DEADLINE_EVENT: {
            // the autoscheduler generates a new list of events based on the deadline
            const newEvents = autoSchedule(
                state.events,
                action.payload.deadline,
                moment().hour(9),
                moment().hour(17),
                state.maxDeadlineId,
            );

            // the new list of events is are put on the calendar, overwriting the old ones
            if (newEvents
                && newEvents.length
                && newEvents.length >= Object.values(state.events).length) {
                // set the ids
                Object.keys(newEvents).forEach((key) => {
                    newEvents[key].id = key;
                });

                newState.events = {
                    ...newEvents,
                };
                newState.maxEventId = newEvents.length;

                // add the deadline object to the calendar too to keep track of it
                newState.deadlines[state.maxDeadlineId] = action.payload.deadline;
                newState.deadlines[state.maxDeadlineId].id = state.maxDeadlineId;
                newState.maxDeadlineId = state.maxDeadlineId + 1;
            }
            break;
        }
        case MOVE_EVENT: {
            const {
                id,
                amount,
                type,
                snap,
            } = action.payload;
            if (!newState.events[id]) {
                break;
            }
            const newEvent = newState.events[id].clone();
            const start = newEvent.startTime.clone().add(amount, type);
            let diff = 0;
            if (snap) {
                const virtualStart = start.diff(start.clone().startOf('day'), 'minutes');
                diff = Math.round(virtualStart / snap) * snap - virtualStart;
            }
            start.add(diff, 'minutes');
            const end = newEvent.endTime.clone().add(amount, type).add(diff, 'minutes');
            if (amount > 0) {
                newEvent.endTime = end;
                newEvent.startTime = start;
            } else {
                newEvent.startTime = start;
                newEvent.endTime = end;
            }
            newEvent.id = id;
            newState.events[id] = newEvent;
            break;
        }
        case CHANGE_START: {
            const { id, start, snap } = action.payload;
            if (!newState.events[id]) {
                break;
            }
            const newEvent = newState.events[id].clone();
            let diff = 0;
            if (snap) {
                const virtualStart = start.diff(start.clone().startOf('day'), 'minutes');
                diff = Math.round(virtualStart / snap) * snap - virtualStart;
            }
            start.add(diff, 'minutes');
            try {
                newEvent.startTime = start;
            } catch {
                break;
            }
            newEvent.id = id;
            newState.events[id] = newEvent;
            break;
        }
        case CHANGE_END: {
            const { id, end, snap } = action.payload;
            if (!newState.events[id]) {
                break;
            }
            const newEvent = newState.events[id].clone();
            let diff = 0;
            if (snap) {
                const virtualStart = end.diff(end.clone().startOf('day'), 'minutes');
                diff = Math.round(virtualStart / snap) * snap - virtualStart;
            }
            end.add(diff, 'minutes');
            try {
                newEvent.endTime = end;
            } catch {
                break;
            }
            newEvent.id = id;
            newState.events[id] = newEvent;
            break;
        }
        case CUT: {
            const { id } = action.payload;
            if (!newState.events[id]) {
                break;
            }
            newState.clipboard = newState.events[id].clone();
            delete newState.events[id];
            break;
        }
        case COPY: {
            const { id } = action.payload;
            if (!newState.events[id]) {
                break;
            }
            newState.clipboard = newState.events[id].clone();
            break;
        }
        case PASTE: {
            if (newState.clipboard == null) {
                break;
            }
            const { type } = action.payload;
            const time = action.payload.time.clone();
            const newEvent = newState.clipboard.clone();
            const length = newEvent.endTime.diff(newEvent.startTime);

            if (type === SET_DAY) {
                time.hour(newEvent.startTime.hour());
                time.minute(newEvent.startTime.minute());
            }
            time.second(0);
            time.millisecond(0);
            if (time.diff(newEvent.startTime) < 0) {
                newEvent.startTime = time;
                newEvent.endTime = time.clone().add(length, 'ms');
            } else {
                newEvent.endTime = time.clone().add(length, 'ms');
                newEvent.startTime = time;
            }
            newEvent.id = state.maxEventId;
            newState.events[state.maxEventId] = newEvent;
            newState.maxEventId += 1;
            break;
        }
        case SYNC_FROM: {
            // deserialize the events and deadlines lists passed in through the payload
            newState = deserializeSyncPayload(
                action.payload.eventsJson,
                action.payload.deadlinesJson,
            );

            break;
        }
        default:
        }
    }

    return newState;
};

export default reducer;
export { deserializeSyncPayload, serializeSyncPayload };
