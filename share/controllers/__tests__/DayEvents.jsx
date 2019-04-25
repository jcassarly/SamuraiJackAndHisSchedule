import React from 'react';
import { mount } from 'enzyme';
import createStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import moment from 'moment-timezone';

import { Settings } from '../../events/Settings';
import DayEvents from '../DayEvents';
import { Event } from '../../events/Event';

const daylight = moment.tz('2019-03-10T08:00:00Z', 'America/New_York');

const mouseDownClosureDrag = jest.fn(() => () => {});
const mouseDownClosureResize = jest.fn(() => () => {});
const clipboardClosure = jest.fn(() => () => {});
const pxToHours = jest.fn(() => {});
const navEditEvent = jest.fn(() => {});

const store = createStore()({
    settings: {
        settings: new Settings(),
    },
});
function createDayEvents(day, events) {
    return mount(
        <Provider store={store}>
            <DayEvents
                navEditEvent={navEditEvent}
                day={day}
                events={events}
                resizing={false}
                startSelected={false}
                mouseMove={0}
                mouseDownClosureDrag={mouseDownClosureDrag}
                mouseDownClosureResize={mouseDownClosureResize}
                clipboardClosure={clipboardClosure}
                pxToHours={pxToHours}
            />
        </Provider>,
    ).find('DayEventsController').at(0);
}

test('renders single event', () => {
    const name = 'test';
    const events = [
        new Event(name, 'test description',
            daylight, daylight.clone().add(3, 'hours')),
    ];
    events[0].id = 2;
    const day = createDayEvents(daylight, events);
    const eventElems = day.find('DayEvent');
    expect(eventElems).toHaveLength(1);
    expect(eventElems.at(0).prop('event').id).toBe(events[0].id);
});

test('renders multiple events', () => {
    const names = [
        'test1',
        'test2',
    ];
    const events = [
        new Event(names[0], 'test description',
            daylight, daylight.add(3, 'hours')),
        new Event(names[1], 'test description 2',
            daylight.clone().add(3, 'hours'), daylight.clone().add(3, 'hours').add(30, 'minutes')),
    ];
    events[0].id = 3;
    events[1].id = 4;

    const day = createDayEvents(daylight, events);
    const eventElems = day.find('DayEvent');
    expect(eventElems).toHaveLength(2);
    expect(eventElems.at(0).prop('event').id).toBe(events[0].id);
    expect(eventElems.at(1).prop('event').id).toBe(events[1].id);
});
