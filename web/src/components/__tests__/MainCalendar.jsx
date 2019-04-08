import React from 'react';
import { mount } from 'enzyme';
import createStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import moment from 'moment-timezone';
import MainCalendar from '../MainCalendar';

const currDate = new Date('2019-03-19T08:00:00Z');
moment.now = () => currDate;
const navNewEvent = jest.fn(() => {});
const store = createStore()({ events: { maxId: 0, events: {} } });
let calendar = mount(
    <Provider store={store}><MainCalendar navNewEvent={navNewEvent} /></Provider>,
).find('MainCalendar').at(0);
test('test month', () => {
    expect(calendar).toHaveState('type', 'month');
    expect(calendar).toContainExactlyOneMatchingElement('Month');
    expect(calendar.find('Month').at(0).prop('month').valueOf()).toBe(currDate.valueOf());
});

test('test left nav month', () => {
    calendar.instance().onLeft();
    expect(calendar.state('date').month()).toBe(1);
});

test('test right nav month', () => {
    calendar.instance().onRight();
    expect(calendar.state('date').month()).toBe(2);
});

test('test week', () => {
    calendar.instance().onSwitch();
    calendar = calendar.update().find('MainCalendar').at(0);
    expect(calendar).toHaveState('type', 'week');
    expect(calendar).toContainExactlyOneMatchingElement('Week');
    expect(calendar.find('Week').at(0).prop('week').valueOf()).toBe(currDate.valueOf());
});

test('test left nav week', () => {
    calendar.instance().onLeft();
    expect(calendar.state('date').week()).toBe(11);
});

test('test right nav week', () => {
    calendar.instance().onRight();
    expect(calendar.state('date').week()).toBe(12);
});

test('test day', () => {
    calendar.instance().onSwitch();
    calendar = calendar.update().find('MainCalendar').at(0);
    expect(calendar).toHaveState('type', 'day');
    expect(calendar).toContainExactlyOneMatchingElement('Day');
    expect(calendar.find('Day').at(0).prop('day').valueOf()).toBe(currDate.valueOf());
});

test('test left nav day', () => {
    calendar.instance().onLeft();
    expect(calendar.state('date').date()).toBe(18);
});

test('test right nav day', () => {
    calendar.instance().onRight();
    expect(calendar.state('date').date()).toBe(19);
});
