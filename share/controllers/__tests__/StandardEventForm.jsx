/* disable-eslint */

import React from 'react';
import moment from 'moment';
import {
    render,
    fireEvent,
    cleanup,
} from 'react-testing-library';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import StandardEventForm from '../StandardEventForm';
import rootReducer from '../../reducers/index';
import Frequency from '../../events/Frequency';
import Notifications from '../../events/Notifications';

const store = createStore(rootReducer);

afterEach(cleanup);

moment.now = () => new Date('2019-03-19T08:00:00Z');

test('changes name', () => {
    // render the event form
    const { getByPlaceholderText } = render(
        <Provider store={store}><StandardEventForm returnHome={() => {}} /></Provider>,
    );

    // find the name field
    const input = getByPlaceholderText('Event Name');
    expect(input.value).toEqual('');

    // change the value in the field
    fireEvent.input(input, { target: { value: 'test' } });

    // check that the value changed
    expect(input.value).toEqual('test');
});

test('changes description', () => {
    // render the vent form
    const { getByPlaceholderText } = render(
        <Provider store={store}><StandardEventForm returnHome={() => {}} /></Provider>,
    );

    // find the description field
    const input = getByPlaceholderText('Event Description');
    expect(input.value).toEqual('');

    // change the value in the field
    fireEvent.change(input, { target: { value: 'test' } });

    // check that the value changed
    expect(input.value).toEqual('test');
});

test('changes start date to first of month correctly', () => {
    // render the event form
    const { getByPlaceholderText, getByText } = render(
        <Provider store={store}><StandardEventForm returnHome={() => {}} /></Provider>,
    );

    // find the start date and set it to be the first day of
    // the month at the current time
    const startDateInput = getByPlaceholderText('Event Start Time');

    // get the button that represents the first of the month
    const firstDayOfMonth = getByText('1');

    // click the button
    fireEvent.click(firstDayOfMonth);

    // expected date
    const startDate = moment().date(1);

    // check the click updated the form correctly
    expect(startDateInput.value).toEqual(startDate.format('L LT'));
});

test('changes end date to third of month plus 1 hour from current time correctly', () => {
    // render the event
    const { getByPlaceholderText, getAllByText } = render(
        <Provider store={store}><StandardEventForm returnHome={() => {}} /></Provider>,
    );

    // find the end date and set it to be the third date of
    // the month at the current time plus an hour
    const endDateInput = getByPlaceholderText('Event End Time');

    // get the button that represents the third day of the month
    const thirdDayOfMonth = getAllByText('3')[2]; // third is the first in endDateInput

    // click the button
    fireEvent.click(thirdDayOfMonth);

    // epxected resulting date
    const endDate = moment().date(1).add(2, 'day').add(1, 'hour');

    // check the click updated the form correctly
    expect(endDateInput.value).toEqual(endDate.format('L LT'));
});

test('changing start date to after end date pulls up error message', () => {
    // render the event form
    const {
        getByPlaceholderText, getByText, getAllByText,
    } = render(
        <Provider store={store}><StandardEventForm returnHome={() => {}} /></Provider>,
    );

    // find the start date and set it to be the third day of
    // the month at the current time
    const startDateInput = getByPlaceholderText('Event Start Time');

    // get the button that represents the third day of the month on the start Date Input
    const thirdDayOfMonth = getByText('3');

    // click the button
    fireEvent.click(thirdDayOfMonth);

    // expected result
    const startDate = moment().date(1).add(2, 'day');

    // check the form changed correctly
    expect(startDateInput.value).toEqual(startDate.format('L LT'));

    // find the end date and set it to be the first date of
    // the month at the current time plus an hour
    const endDateInput = getByPlaceholderText('Event End Time');

    // get the button that represents the first day of the month on the end date input
    const firstDayOfMonth = getAllByText('1')[2]; // third is the first in endDateInput

    // click the button
    fireEvent.click(firstDayOfMonth);

    // expected result
    const endDate = moment().date(1).add(1, 'hour');

    // check that the form updated correctly
    expect(endDateInput.value).toEqual(endDate.format('L LT'));

    // submit the event
    const submitEvent = getByText('Submit');

    fireEvent.click(submitEvent);

    // check that the error message appeared
    const errorDiv = getByText('Please enter a valid date combination');

    expect(errorDiv).toBeDefined();
});

test('changes location correctly', () => {
    // render the event form
    const { getByPlaceholderText } = render(
        <Provider store={store}><StandardEventForm returnHome={() => {}} /></Provider>,
    );

    // find the location field
    const input = getByPlaceholderText('Event Location');
    expect(input.value).toEqual('anywhere');

    // change the value
    fireEvent.change(input, { target: { value: 'test' } });

    // check the result
    expect(input.value).toEqual('test');
});

test('changes frequency to weekly correctly', () => {
    // render the event form
    const { getByText } = render(
        <Provider store={store}><StandardEventForm returnHome={() => {}} /></Provider>,
    );

    // find the frequency field
    const input = getByText('Event Frequency:').children.frequency;
    expect(input.value).toEqual('');

    // change the selected option
    fireEvent.change(input, { target: { value: Frequency.freqEnum.WEEKLY } });

    // check the resulting change
    expect(input.value).toEqual(Frequency.freqEnum.WEEKLY);
});

test('changes notifications to email correctly', () => {
    // render the event form
    const { getByText } = render(
        <Provider store={store}><StandardEventForm returnHome={() => {}} /></Provider>,
    );

    // find the notifications field
    const input = getByText('Notification Type:').children.notifications;
    expect(input.value).toEqual('');

    // change the selected opition
    fireEvent.change(input, { target: { value: Notifications.noteEnum.EMAIL } });

    // check the resulting change
    expect(input.value).toEqual(Notifications.noteEnum.EMAIL);
});

test('changes notification time correctly', () => {
    // render the event form
    const { getByPlaceholderText } = render(
        <Provider store={store}><StandardEventForm returnHome={() => {}} /></Provider>,
    );

    // find the notification time field
    const input = getByPlaceholderText('Notification Time');
    expect(input.value).toEqual('0');

    // change the value in the field
    input.value = 123;

    fireEvent.change(input, { target: { value: 123 } });

    // check the result
    expect(input.value).toEqual('123');
});

test('changes lock value correctly', () => {
    // render the event form
    const { getByPlaceholderText } = render(
        <Provider store={store}><StandardEventForm returnHome={() => {}} /></Provider>,
    );

    // find the lock field
    const input = getByPlaceholderText('Lock Event');
    expect(input.value).toEqual(''); // starts as empty string

    // deselect the lock option
    fireEvent.click(input);

    expect(input.value).toBeFalsy();

    // select the lock option
    fireEvent.click(input);

    expect(input.value).toEqual('');
});
