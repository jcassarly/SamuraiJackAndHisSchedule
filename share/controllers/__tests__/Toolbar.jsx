import React from 'react';
import {
    render,
    fireEvent,
    cleanup,
} from 'react-testing-library';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import Toolbar from '../Toolbar';
import rootReducer from '../../reducers/index';

jest.mock('../../em2px');

const store = createStore(rootReducer);

afterEach(cleanup);

const navNewEvent = jest.fn(() => {});
test('toolbar works', () => {
    const { getByText } = render(
        <Provider store={store}><Toolbar navNewEvent={navNewEvent} /></Provider>,
    );

    const newEventButton = getByText('New Event');

    fireEvent.click(newEventButton);

    expect(navNewEvent.mock.calls).toHaveLength(1);
});
