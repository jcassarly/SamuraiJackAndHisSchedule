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

    fireEvent.input(input, { target: { value: 'test' } });

    expect(input.value).toEqual('test');
});

test('changes description', () => {
    const { getByPlaceholderText } = render(
        <Provider store={store}><StandardEventForm returnHome={() => {}} /></Provider>,
    );

    const input = getByPlaceholderText('Event Description');
    expect(input.value).toEqual('');

    fireEvent.change(input, { target: { value: 'test' } });

    expect(input.value).toEqual('test');
});

test('changes start date to first of month correctly', () => {
    const { getByPlaceholderText, getByText } = render(
        <Provider store={store}><StandardEventForm returnHome={() => {}} /></Provider>,
    );

    // find the start date and set it to be the first day of
    // the month at the current time
    const startDateInput = getByPlaceholderText('Event Start Time');

    const firstDayOfMonth = getByText('1');

    fireEvent.click(firstDayOfMonth);

    const startDate = moment().date(1);

    expect(startDateInput.value).toEqual(startDate.format('L LT'));
});

test('changes end date to third of month plus 1 hour from current time correctly', () => {
    const { getByPlaceholderText, getByText, getAllByText } = render(
        <Provider store={store}><StandardEventForm returnHome={() => {}} /></Provider>,
    );

    // find the end date and set it to be the third date of
    // the month at the current time plus an hour
    const endDateInput = getByPlaceholderText('Event End Time');

    const thirdDayOfMonth = getAllByText('3')[2]; // third is the first in endDateInput

    fireEvent.click(thirdDayOfMonth);

    const endDate = moment().date(1).add(2, 'day').add(1, 'hour');

    expect(endDateInput.value).toEqual(endDate.format('L LT'));
})

test('changes location correctly', () => {
    const { getByPlaceholderText } = render(
        <Provider store={store}><StandardEventForm returnHome={() => {}} /></Provider>,
    );

    const input = getByPlaceholderText('Event Location');
    expect(input.value).toEqual('');

    fireEvent.change(input, { target: { value: 'test' } });

    expect(input.value).toEqual('test');
});

test('changes frequency to weekly correctly', () => {
    const { getByText } = render(
        <Provider store={store}><StandardEventForm returnHome={() => {}} /></Provider>,
    );

    const input = getByText('Event Frequency:').children.frequency;
    expect(input.value).toEqual('');

    fireEvent.change(input, { target: { value: Frequency.freqEnum.WEEKLY } });

    expect(input.value).toEqual(Frequency.freqEnum.WEEKLY);
});

test('changes notifications to email correctly', () => {
    const { getByText } = render(
        <Provider store={store}><StandardEventForm returnHome={() => {}} /></Provider>,
    );

    const input = getByText('Notification Type:').children.notifications;
    expect(input.value).toEqual('');

    fireEvent.change(input, { target: { value: Notifications.noteEnum.EMAIL } });

    expect(input.value).toEqual(Notifications.noteEnum.EMAIL);
});

test('changes notification time correctly', () => {
    const { getByPlaceholderText } = render(
        <Provider store={store}><StandardEventForm returnHome={() => {}} /></Provider>,
    );

    const input = getByPlaceholderText('Notification Time');
    expect(input.value).toEqual('0');

    input.value = 123;

    fireEvent.change(input, { target: { value: 123 } });

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
