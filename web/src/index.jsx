import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import 'normalize.css';

import './styles/index.css';
import App from './components/App';
import rootReducer from './reducers/index';
import { saveState } from './reducers/persistState';

// create the store
const store = createStore(
    rootReducer,
    applyMiddleware(thunk),
);

// save to local storage
saveState(store.getState());

// update changes to the local storage
store.subscribe(() => {
    saveState(store.getState());
});

ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('root'));
