import { Event } from '../events/Event';
import { CREATE_EVENT } from '../actions/createEvent'

const initialState = { maxId: 0, events: {} };

const reducer = (state = initialState, action) => {
    const newState = {...state}
    if(action) {
        switch(action.type) {
            case CREATE_EVENT:
                newState.events[state.maxId] = action.payload.event;
                newState.maxId += 1;
                break;
            default:
        }
    }

    return newState;
}

export default reducer;
