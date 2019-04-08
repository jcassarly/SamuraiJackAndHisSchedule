import { combineReducers } from 'redux';
import events from './events';
import settings from './settings';

const rootReducer = combineReducers({
    events,
    settings,
});

export default rootReducer;
