import _ from 'lodash';
import { Event, deserialize } from '../events/Event';

const initialState = { events: { maxId: 0, events: {} }, settings: { settings: null } };

const loadState = () => {
    const state = {};
    try {
        const serializedEvents = localStorage.getItem('events');
        const serializedSettings = localStorage.getItem('settings');
        if (serializedEvents == null) {
            state.events = initialState.events;
        } else {
            state.events = JSON.parse(serializedEvents, (key, value) => {
                if (key === 'events') {
                    const newVals = _.mapValues(value, value => deserialize(JSON.stringify(value)));
                    return newVals;
                }
                return value;
            });
        }
        if (serializedSettings == null) {
            state.settings = initialState.settings;
        } else {
            state.settings = initialState.settings;
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
        const serializedEvents = JSON.stringify(state.events, (key, value) => {
            if (value instanceof Event) {
                return value.serialize();
            }
            return value;
        });
        const serializedSettings = JSON.stringify(state.settings);
        localStorage.setItem('events', serializedEvents);
        localStorage.setItem('settings', serializedSettings);
    } catch (err) {
        console.error(err);
        console.error('no localStorage available');
    }
};

export { loadState, saveState };
