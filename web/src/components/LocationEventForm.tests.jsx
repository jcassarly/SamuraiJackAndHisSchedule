/* disable-eslint */

import React from 'react';
import moment from 'moment';
import { render, fireEvent, cleanup, getBySelectText } from 'react-testing-library';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import StandardEventForm from './StandardEventForm';
import rootReducer from '../reducers/index';
import Frequency from '../events/Frequency';
import Notifications from '../events/Notifications';

const store = createStore(rootReducer);

afterEach(cleanup);

test('changes lock value correctly', () => {
    const { getByPlaceholderText } = render(
        <Provider store={store}><StandardEventForm returnHome={() => {}} /></Provider>,
    );

    const input = getByPlaceholderText('Lock Event');
    expect(input.value).toEqual(''); // starts as empty string

    fireEvent.click(input);

    expect(input.value).toBeFalsy();

    fireEvent.click(input);

    expect(input.value).toEqual('');
});
