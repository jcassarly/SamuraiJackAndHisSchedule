import moment from 'moment';
import { CREATE_EVENT, CREATE_DEADLINE_EVENT, SET_LISTS } from '../actions/createEvent';
import autoSchedule from '../events/AutoScheduler';

// the user starts out with no events
// each event needs an id, these ids are assigned in order, maxId keeps track of the largest
const initialState = {
    maxEventId: 0,
    events: {},
    maxDeadlineId: 0,
    deadlines: {},
};

/**
 * reducer for the list of all events the user has
 */
const reducer = (state = initialState, action) => {
    // copy the old state
    const newState = { ...state };
    newState.events = { ...state.events };

    if (action) {
        // mutate state depending on the type of the action
        switch (action.type) {
        // adds a new event
        case CREATE_EVENT:
            // adds a new event with an id corresponding to max id
            newState.events[state.maxEventId] = action.payload.event;
            newState.maxEventId += 1;
            break;

        // adds a new deadline event
        case CREATE_DEADLINE_EVENT: {
            // the autoscheduler generates a new list of events based on the deadline
            const newEvents = autoSchedule(
                state.events,
                action.payload.deadline,
                moment().hour(9),
                moment().hour(17),
            );

            // the new list of events is are put on the calendar, overwriting the old ones
            if (newEvents && newEvents.length && newEvents.length >= Object.values(state.events)) {
                newState.events = {
                    ...newEvents,
                };
                newState.maxEventId = newEvents.length;

                // add the deadline object to the calendar too to keep track of it
                newState.deadlines[state.maxDeadlineId] = action.payload.deadline;
                newState.maxDeadlineId += 1;
            }
            break;
        }
        case SET_LISTS: {
            // change the event list to the new one and update the length
            newState.events = {
                ...action.payload.events,
            };
            newState.maxEventId = newState.events.length;

            // change the deadline list to the new one and update the length
            newState.deadlines = {
                ...action.payload.deadlines,
            };
            newState.maxDeadlineId = newState.deadlines.length;

            break;
        }
        default:
        }
    }

    return newState;
};

export default reducer;
