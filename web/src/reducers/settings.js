import moment from 'moment';
import { UPDATE_SETTINGS } from '../actions/updateSettings';
import Settings from '../events/Settings';

const initialState = { settings: new Settings() };

const reducer = (state = initialState, action) => {
    const newState = { ...state };
    if (action) {
        switch (action.type) {
        case :
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
