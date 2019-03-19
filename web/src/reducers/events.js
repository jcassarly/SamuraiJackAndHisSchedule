import { CREATE_EVENT, CREATE_DEADLINE_EVENT } from '../actions/createEvent';

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
            break;
        default:
        }
    }

    return newState;
};

export default reducer;
