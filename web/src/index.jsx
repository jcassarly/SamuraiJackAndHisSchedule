import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import moment from 'moment-timezone';

import 'normalize.css';

import './styles/index.css';
import App from './components/App';
import rootReducer from './reducers/index';
import { Event } from './events/Event';
import Deadline from './events/Deadline';
import autoSchedule from './events/AutoScheduler';

const initialEvents = {
    0: new Event('test', null, moment(), moment().add(3, 'hours')),
};
const deadline = new Deadline('dead test', moment('March 31, 2019'), 5, 30, 120, 20, moment());

//console.log(initialEvents);
//console.log(autoSchedule(initialEvents, deadline, moment().startOf('day'), moment().endOf('day')));
//console.log(initialEvents);
const store = createStore(rootReducer);

ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('root'));
