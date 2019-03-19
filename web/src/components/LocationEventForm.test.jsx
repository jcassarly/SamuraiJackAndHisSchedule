/* disable-eslint */

import React from 'react';
import { render, cleanup } from 'react-testing-library';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import LocationEventForm from './LocationEventForm';
import rootReducer from '../reducers/index';

const store = createStore(rootReducer);

afterEach(cleanup);

test('changes lock value correctly', () => {
    const { queryByPlaceholderText } = render(
        <Provider store={store}><LocationEventForm returnHome={() => {}} /></Provider>,
    );

    expect(queryByPlaceholderText('Lock Event')).toBeNull();
});
