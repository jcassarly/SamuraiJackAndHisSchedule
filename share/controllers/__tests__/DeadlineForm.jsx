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
import DeadlineForm from '../DeadlineForm';
import rootReducer from '../../reducers/index';

const store = createStore(rootReducer);

afterEach(cleanup);

moment.now = () => new Date('2019-03-19T08:00:00Z');

test('changes name', () => {
    // render the Deadline form
    const { getByPlaceholderText } = render(
        <Provider store={store}><DeadlineForm returnHome={() => {}} /></Provider>,
    );

    // find the name field
    const input = getByPlaceholderText('Event Name');
    expect(input.value).toEqual('');

    // change the value in the name field
    fireEvent.input(input, { target: { value: 'test' } });

    // check that the change was correct
    expect(input.value).toEqual('test');
});

test('changes description', () => {
    // render the Deadline form
    const { getByPlaceholderText } = render(
        <Provider store={store}><DeadlineForm returnHome={() => {}} /></Provider>,
    );

    // find the description field
    const input = getByPlaceholderText('Event Description');
    expect(input.value).toEqual('');

    // change the value in the description field
    fireEvent.change(input, { target: { value: 'test' } });

    // check that the change was correct
    expect(input.value).toEqual('test');
});

test('changes start date to first of month correctly', () => {
    // render the Deadline form
    const { getByPlaceholderText, getByText } = render(
        <Provider store={store}><DeadlineForm returnHome={() => {}} /></Provider>,
    );

    // find the start date and set it to be the first day of
    // the month at the current time
    const startDateInput = getByPlaceholderText('Task Start Time');

    // find the first day of the month button and select that day
    const firstDayOfMonth = getByText('1');
    fireEvent.click(firstDayOfMonth);

    // check that the input field changed based on the date change
    const startDate = moment().date(1);
    expect(startDateInput.value).toEqual(startDate.format('L LT'));
});

test('changes end date to third of month plus 1 hour from current time correctly', () => {
    // render the deadline form
    const { getByPlaceholderText, getAllByText } = render(
        <Provider store={store}><DeadlineForm returnHome={() => {}} /></Provider>,
    );

    // find the end date and set it to be the third date of
    // the month at the current time plus an hour
    const endDateInput = getByPlaceholderText('Task Deadline');

    // find the third day of the month in the end date and select that day
    const thirdDayOfMonth = getAllByText('3')[2]; // third is the first in endDateInput
    fireEvent.click(thirdDayOfMonth);

    // check that the input field changed based on the date change
    // adding 12 hours because of default deadline length being different than event
    const endDate = moment().date(1).add(2, 'day').add(12, 'hour');
    expect(endDateInput.value).toEqual(endDate.format('L LT'));
});

test('changing start date to after end date pulls up error message', () => {
    // render the deadline form
    const {
        getByPlaceholderText, getByText, getAllByText,
    } = render(
        <Provider store={store}><DeadlineForm returnHome={() => {}} /></Provider>,
    );

    // find the start date and set it to be the third day of
    // the month at the current time
    const startDateInput = getByPlaceholderText('Task Start Time');

    // find the third day of the month and select it
    const thirdDayOfMonth = getByText('3');
    fireEvent.click(thirdDayOfMonth);

    // check that the input field updated correctly
    const startDate = moment().date(1).add(2, 'day');
    expect(startDateInput.value).toEqual(startDate.format('L LT'));

    // find the end date and set it to be the first date of
    // the month at the current time plus an hour
    const endDateInput = getByPlaceholderText('Task Deadline');

    // find the first day of the month in the end date and select it
    const firstDayOfMonth = getAllByText('1')[2]; // third is the first in endDateInput
    fireEvent.click(firstDayOfMonth);

    // check that the input field updated correctly
    const endDate = moment().date(1).add(12, 'hour');
    expect(endDateInput.value).toEqual(endDate.format('L LT'));

    // submit the event
    const submitEvent = getByText('Submit');
    fireEvent.click(submitEvent);

    // check that the error message appeared
    const errorDiv = getByText('Please enter a valid date combination');
    expect(errorDiv).toBeDefined();

    // note that the error and callback from this test is expected since the catch
    // still throws the error to the console
});

test('changes location correctly', () => {
    // render the deadline form
    const { getByPlaceholderText } = render(
        <Provider store={store}><DeadlineForm returnHome={() => {}} /></Provider>,
    );

    // find the location input field
    const input = getByPlaceholderText('Event Location');
    expect(input.value).toEqual('anywhere');

    // change the value of the field
    fireEvent.change(input, { target: { value: 'test' } });

    // check that it updated correctly
    expect(input.value).toEqual('test');
});

test('changes use location value correctly', () => {
    // render the deadline form
    const { getByPlaceholderText } = render(
        <Provider store={store}><DeadlineForm returnHome={() => {}} /></Provider>,
    );

    // find the use location input field
    const input = getByPlaceholderText('Use Location');
    expect(input.value).toEqual(''); // starts as empty string

    // click the checkbox to deselect it
    fireEvent.click(input);
    expect(input.value).toBeFalsy();

    // click it again to reselect it
    fireEvent.click(input);
    expect(input.value).toEqual('');
});

/**
 * Tests a number input field for the deadline form
 * @param {string} placeholderText the text to search for to find the input field
 * @param {node}   nodeToRender    the Deadline form JSX to render
 */
function testNumberInput(placeholderText, nodeToRender, startValue) {
    // render the node
    const { getByPlaceholderText } = render(
        nodeToRender,
    );

    // find the number input field
    const input = getByPlaceholderText(placeholderText);
    expect(input.value).toEqual(startValue);

    // change the input field
    input.value = 123;
    fireEvent.input(input, { target: { value: 123 } });

    // check that it update correctly
    expect(input.value).toEqual('123');
}

test('changes min event time correctly', () => {
    testNumberInput(
        'Min Scheduled Event Time',
        <Provider store={store}><DeadlineForm returnHome={() => {}} /></Provider>,
        '15',
    );
});

test('changes max event time correctly', () => {
    testNumberInput(
        'Max Scheduled Event Time',
        <Provider store={store}><DeadlineForm returnHome={() => {}} /></Provider>,
        '120',
    );
});

test('changes min break time correctly', () => {
    testNumberInput(
        'Min Time Between Events',
        <Provider store={store}><DeadlineForm returnHome={() => {}} /></Provider>,
        '15',
    );
});

test('changes total time correctly', () => {
    testNumberInput(
        'Total Time to Complete',
        <Provider store={store}><DeadlineForm returnHome={() => {}} /></Provider>,
        '60',
    );
});
