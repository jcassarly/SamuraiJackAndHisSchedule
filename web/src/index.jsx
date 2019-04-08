import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import 'normalize.css';

import './styles/index.css';
import App from './components/App';
import rootReducer from './reducers/index';
import { saveState } from './reducers/persistState';

const store = createStore(rootReducer);
saveState(store.getState());
store.subscribe(() => {
    saveState(store.getState());
});

ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('root'));
