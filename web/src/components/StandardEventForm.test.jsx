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

test('changes name', () => {
    const { getByPlaceholderText } = render(
        <Provider store={store}><StandardEventForm returnHome={() => {}} /></Provider>,
    );

    const input = getByPlaceholderText('Event Name');
    expect(input.value).toEqual('');

    input.value = 'test';

    fireEvent.change(input);

    expect(input.value).toEqual('test');
});

test('changes description', () => {
    const { getByPlaceholderText } = render(
        <Provider store={store}><StandardEventForm returnHome={() => {}} /></Provider>,
    );

    const input = getByPlaceholderText('Event Description');
    expect(input.value).toEqual('');

    input.value = 'test';

    fireEvent.change(input);

    expect(input.value).toEqual('test');
});

test('changes start date correctly', () => {
    const { getByPlaceholderText } = render(
        <Provider store={store}><StandardEventForm returnHome={() => {}} /></Provider>,
    );

    const input = getByPlaceholderText('Event Start Time');

    const date = moment();
    input.start = date;

    fireEvent.change(input);

    expect(input.start).toEqual(date);
});

test('changes location correctly', () => {
    const { getByPlaceholderText } = render(
        <Provider store={store}><StandardEventForm returnHome={() => {}} /></Provider>,
    );

    const input = getByPlaceholderText('Event Location');
    expect(input.value).toEqual('');

    input.value = 'test';

    fireEvent.change(input);

    expect(input.value).toEqual('test');
});

test('changes frequency to weekly correctly', () => {
    const { getByText } = render(
        <Provider store={store}><StandardEventForm returnHome={() => {}} /></Provider>,
    );

    const input = getByText('Event Frequency:').children.frequency;
    expect(input.value).toEqual('');

    input.value = Frequency.freqEnum.WEEKLY;

    fireEvent.change(input);

    expect(input.value).toEqual(Frequency.freqEnum.WEEKLY);
});

test('changes notifications to email correctly', () => {
    const { getByText } = render(
        <Provider store={store}><StandardEventForm returnHome={() => {}} /></Provider>,
    );

    const input = getByText('Notification Type:').children.notifications;
    expect(input.value).toEqual('');

    input.value = Notifications.noteEnum.EMAIL;

    fireEvent.change(input);

    expect(input.value).toEqual(Notifications.noteEnum.EMAIL);
});

test('changes notification time correctly', () => {
    const { getByPlaceholderText } = render(
        <Provider store={store}><StandardEventForm returnHome={() => {}} /></Provider>,
    );

    const input = getByPlaceholderText('Notification Time');
    expect(input.value).toEqual('0');

    input.value = 123;

    fireEvent.change(input);

    expect(input.value).toEqual('123');
});

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
