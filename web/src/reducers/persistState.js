import _ from 'lodash';
import { Event, deserialize } from '../events/Event';
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
    const state = {};
    try {
        // get the local storage
        const serializedEvents = localStorage.getItem('events');
        const serializedDeadlines = localStorage.getItem('deadlines');
        const serializedSettings = localStorage.getItem('settings');

        // deserialize the events
        state.events = deserializeSyncPayload(serializedEvents, serializedDeadlines);

        if (serializedSettings == null) {
            state.settings = initialState.settings;
        } else {
            state.settings = deserializeSettings(serializedSettings);
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
        const {
            serializedEvents,
            serializedDeadlines,
            serializedSettings,
        } = serializeSyncPayload(
            state.events.events,
            state.events.deadlines,
            state.settings.settings,
        );
        localStorage.setItem('events', serializedEvents);
        localStorage.setItem('deadlines', serializedDeadlines);
        localStorage.setItem('settings', serializedSettings);
    } catch (err) {
        console.error(err);
        console.error('no localStorage available');
    }
};

export { loadState, saveState };
