import { UPDATE_SETTINGS } from '../actions/updateSettings';
// import Settings from '../events/Settings';

// the user starts out with the default settings
const initialState = { settings: null }; // new Settings() };

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

        default:
        }
    }

    return newState;
};

export default reducer;
