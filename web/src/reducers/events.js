import moment from 'moment';
import { CREATE_EVENT, CREATE_DEADLINE_EVENT } from '../actions/createEvent';
import autoSchedule from '../events/AutoScheduler';

const initialState = { maxId: 0, events: {}, deadlines: {} };

const reducer = (state = initialState, action) => {
    const newState = { ...state };
    if (action) {
        switch (action.type) {
        case CREATE_EVENT:
            newState.events[state.maxId] = action.payload.event;
            newState.maxId += 1;
            break;
        case CREATE_DEADLINE_EVENT: {
            const newEvents = autoSchedule(
                state.events,
                action.payload.deadline,
                moment().hour(9),
                moment().hour(17),
            );
            newState.events = {
                ...newEvents,
            };
            newState.maxId = newEvents.length;
            break;
        }
        default:
        }
    }

    return newState;
};

export default reducer;
