import { combineReducers } from 'redux';
import events from './events';
import settings from './settings';

/**
 * primary reducer, combines all reducers
 */
const rootReducer = combineReducers({
    events,
    settings,
});

export default rootReducer;
