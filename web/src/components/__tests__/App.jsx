import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import moment from 'moment';
import { render, fireEvent, cleanup } from 'react-testing-library';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import rootReducer from '../reducers/index';
import { EventEnum } from './ChooseEventType';

const store = createStore(rootReducer);

afterEach(cleanup);

moment.now = () => new Date('2019-03-19T08:00:00Z');

/* it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
        <Provider store={store}><App /></Provider>,
        document.getElementById('root'),
    );
    ReactDOM.unmountComponentAtNode(div);
}); */

test('changes name', () => {
    const { getByText, getByPlaceholderText, getAllByText } = render(
        <Provider store={store}><App /></Provider>,
    );

    expect(store.getState().events.events).toEqual({});

    // create a new event
    const input = getByText('New Event');

    fireEvent.click(input);

    // find the choice element
    const choose = getByText('Choose Event Type:').children[0];

    expect(choose.value).toEqual('Choose');

    choose.value = EventEnum.STANDARD;

    // change the choice to standard event
    fireEvent.change(choose);

    expect(choose.value).toEqual(EventEnum.STANDARD);

    // submit the change
    const submitChoose = getByText('Submit');

    fireEvent.click(submitChoose);

    // find the name input and enter a name
    const nameInput = getByPlaceholderText('Event Name');
    expect(nameInput.value).toEqual('');

    fireEvent.input(nameInput, { target: { value: 'test' } });

    expect(nameInput.value).toEqual('test');

    // find the start date and set it to be the first day of
    // the month at the current time
    const startDateInput = getByPlaceholderText('Event Start Time');

    const firstDayOfMonth = getByText('1');

    fireEvent.click(firstDayOfMonth);

    const startDate = moment().date(1);

    expect(startDateInput.value).toEqual(startDate.format('L LT'));

    // find the end date and set it to be the third date of
    // the month at the current time plus an hour
    const endDateInput = getByPlaceholderText('Event End Time');

    const thirdDayOfMonth = getAllByText('3')[2]; // third is the first in endDateInput

    fireEvent.click(thirdDayOfMonth);

    const endDate = startDate.clone().add(2, 'day').add(1, 'hour');

    expect(endDateInput.value).toEqual(endDate.format('L LT'));

    // submit the event
    const submitEvent = getByText('Submit');

    fireEvent.click(submitEvent);

    // check the store
    expect(store.getState().events.events[0].name).toEqual('test');
    expect(store.getState().events.events[0].startTime.format('L LT')).toEqual(startDate.format('L LT'));
    expect(store.getState().events.events[0].endTime.format('L LT')).toEqual(endDate.format('L LT'));
});
