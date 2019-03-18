/* disable-eslint */

import React from 'react';
import { render, fireEvent, cleanup } from 'react-testing-library';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import LocationEventForm from './LocationEventForm';
import rootReducer from '../reducers/index';

const store = createStore(rootReducer);

afterEach(cleanup);

test('changes lock value correctly', () => {
    const { getByPlaceholderText } = render(
        <Provider store={store}><LocationEventForm returnHome={() => {}} /></Provider>,
    );

    const input = getByPlaceholderText('Lock Event');
    expect(input.value).toEqual(''); // starts as empty string

    fireEvent.click(input);

    expect(input.value).toBeFalsy();

    fireEvent.click(input);

    expect(input.value).toEqual('');
});
