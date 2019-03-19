import moment from 'moment';
import { CREATE_EVENT, CREATE_DEADLINE_EVENT } from '../actions/createEvent';
import autoSchedule from '../events/AutoScheduler';

const initialState = { maxId: 0, events: {} };

const reducer = (state = initialState, action) => {
    const newState = { ...state };
    if (action) {
        switch (action.type) {
        case CREATE_EVENT:
            newState.events[state.maxId] = action.payload.event;
            newState.maxId += 1;
            break;
        case CREATE_DEADLINE_EVENT:
            newState.events = {
                ...autoSchedule(
                    state.events,
                    action.payload.deadline,
                    moment().hour(9),
                    moment().hour(17),
                ),
            };
            newState.maxId = newState.events.length();
            break;
        default:
        }
    }

    return newState;
};

export default reducer;
