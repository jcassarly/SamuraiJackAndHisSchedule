import moment from 'moment';
import { CREATE_EVENT, CREATE_DEADLINE_EVENT } from '../actions/createEvent';
import { MOVE_EVENT } from '../actions/changeEvent';
import autoSchedule from '../events/AutoScheduler';

// the user starts out with no events
// each event needs an id, these ids are assigned in order, maxId keeps track of the largest
const initialState = { maxId: 0, events: {} };

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
        case MOVE_EVENT: {
            const { id, amount, type } = action.payload;
            const newEvent = newState.events[id].clone();
            const start = newEvent.startTime.clone().add(amount, type);
            const end = newEvent.endTime.clone().add(amount, type);
            if (amount > 0) {
                newEvent.endTime = end;
                newEvent.startTime = start;
            } else {
                newEvent.startTime = start;
                newEvent.endTime = end;
            }
            newState.events[id] = newEvent;
            break;
        }
        default:
        }
    }

    return newState;
};

export default reducer;
