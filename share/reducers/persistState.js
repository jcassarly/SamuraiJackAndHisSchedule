import { Settings, deserializeSettings } from '../events/Settings';
import { deserializeSyncPayload, serializeSyncPayload } from './events';

const initialState = {
    events: {
        maxEventId: 0,
        events: {},
        maxDeadlineId: 0,
        deadlines: {},
    },
    settings: {
        settings: new Settings(),
    },
};

const loadState = () => {
    const state = initialState;
    try {
        // get the local storage
        const parsedStorage = JSON.parse(localStorage.getItem('state'));

        if (parsedStorage != null) {
            // deserialize the events and deadlines
            state.events = deserializeSyncPayload(
                JSON.parse(parsedStorage.events),
                JSON.parse(parsedStorage.deadlines),
            );
            state.settings.settings = deserializeSettings(parsedStorage.settings);
        }


        return state;
    } catch (err) {
        console.error(err);
        console.error('no localStorage available');
        return initialState;
    }
};

const saveState = (state) => {
    try {
        const serializedState = serializeSyncPayload(
            state.events.events,
            state.events.deadlines,
            state.settings.settings,
        );

        localStorage.setItem('state', serializedState);
    } catch (err) {
        console.error(err);
        console.error('no localStorage available');
    }
};

export { loadState, saveState };
