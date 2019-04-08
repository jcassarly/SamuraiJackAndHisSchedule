import moment from 'moment';
import { CREATE_EVENT, CREATE_DEADLINE_EVENT } from '../actions/createEvent';
import autoSchedule from '../events/AutoScheduler';
import { loadState } from './persistState';

// the user starts out with no events
// each event needs an id, these ids are assigned in order, maxId keeps track of the largest
const initialState = loadState().events;

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
            newState.events[state.maxId] = action.payload.event;
            newState.maxId += 1;
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
                newState.maxId = newEvents.length;
            }
            break;
        }
        default:
        }
    }

    return newState;
};

export default reducer;
