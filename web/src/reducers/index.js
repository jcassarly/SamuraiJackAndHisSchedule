import { combineReducers } from 'redux';
import events from './events';

/**
 * primary reducer, combines all reducers
 */
const rootReducer = combineReducers({
    events,
});

export default rootReducer;
