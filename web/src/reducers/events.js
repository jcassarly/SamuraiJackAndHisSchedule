import moment from 'moment';
import { CREATE_EVENT, CREATE_DEADLINE_EVENT } from '../actions/createEvent';
import { SYNC_FROM } from '../actions/sync';
import autoSchedule from '../events/AutoScheduler';
import { deserialize } from '../events/Event';
import { deserializeDeadline } from '../events/Deadline';

// the user starts out with no events
// each event needs an id, these ids are assigned in order, maxId keeps track of the largest
const initialState = {
    maxEventId: 0,
    events: {},
    maxDeadlineId: 0,
    deadlines: {},
};

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
    Object.keys(events).forEach((key) => {
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
        newEvents,
        newDeadlines,
    };
}

/**
 * reducer for the list of all events the user has
 */
const reducer = (state = initialState, action) => {
    // copy the old state
    const newState = { ...state };
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
            if (newEvents && newEvents.length && newEvents.length >= Object.values(state.events).length) {
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
        case SYNC_FROM: {
            // deserialize the events and deadlines lists passed in through the payload
            const {
                newEvents,
                newDeadlines,
            } = deserializeSyncPayload(action.payload.eventsJson, action.payload.deadlinesJson);

            // change the event list to the new one and update the length
            newState.events = {
                ...newEvents,
            };
            newState.maxEventId = Object.keys(newEvents).length;

            // change the deadline list to the new one and update the length
            newState.deadlines = {
                ...newDeadlines,
            };
            newState.maxDeadlineId = Object.keys(newEvents).length;

            break;
        }
        default:
        }
    }

    return newState;
};

export default reducer;
