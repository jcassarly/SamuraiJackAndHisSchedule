import { UPDATE_SETTINGS } from '../actions/updateSettings';
import { SYNC_FROM } from '../actions/sync';
import { Settings, deserializeSettings } from '../events/Settings';

// the user starts out with the default settings
const initialState = { settings: new Settings() };

/**
 * reducer for the list of all events the user has
 */
const reducer = (state = initialState, action) => {
    // copy the old state
    const newState = { ...state };

    if (action) {
        // mutate state depending on the type of the action
        switch (action.type) {
        // updates the settings
        case UPDATE_SETTINGS:
            // changes the settings to the new settings passed in from the payload
            newState.settings = action.payload.settings;
            break;

        case SYNC_FROM:
            // changes the settings to the settings received from the sync
            newState.settings = deserializeSettings(action.payload.settingsJson);
            break;
        default:
        }
    }

    return newState;
};

export default reducer;
