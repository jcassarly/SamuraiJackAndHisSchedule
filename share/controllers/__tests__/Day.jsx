import React from 'react';
import { shallow } from 'enzyme';
import moment from 'moment-timezone';
import Day from '../Day';
import { Event } from '../../events/Event';

jest.mock('../../em2px');

const nonDaylight = moment.tz('2019-03-19T08:00:00Z', 'America/New_York');
const daylight = moment.tz('2019-03-10T08:00:00Z', 'America/New_York');
const daylightEnd = moment.tz('2019-11-03T08:00:00Z', 'America/New_York');

test('generateHours func', () => {
    const genedHours = Day.generateHours(nonDaylight);
    for (let i = 0; i < 24; i += 1) {
        expect(shallow(genedHours[2 * i])).toHaveText(i.toString());
    }
});

test('renders no-event no-daylight', () => {
    const day = shallow(<Day day={nonDaylight} events={[]} />);
    expect(day.find('.hour')).toHaveLength(24);
    expect(day.find('.evHour')).toHaveLength(24);
});

test('renders no-event daylight', () => {
    const day = shallow(<Day day={daylight} events={[]} />);
    expect(day.find('.hour')).toHaveLength(23);
    expect(day.find('.evHour')).toHaveLength(23);
});

test('renders no-event daylight', () => {
    const day = shallow(<Day day={daylightEnd} events={[]} />);
    expect(day.find('.hour')).toHaveLength(25);
    expect(day.find('.evHour')).toHaveLength(25);
});

test('renders single event no-daylight', () => {
    const name = 'test';
    const events = [
        new Event(name, 'test description',
            daylight, daylight.clone().add(3, 'hours')),
    ];
    const day = shallow(<Day day={daylight} events={events} />);
    const eventElems = day.find('.dayEvents>div');
    expect(eventElems).toHaveLength(1);
    expect(eventElems.at(0)).toHaveText(name);
});

test('renders multiple events no-daylight', () => {
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

    const day = shallow(<Day day={daylight} events={events} />);
    const eventElems = day.find('.dayEvents>div');
    expect(eventElems).toHaveLength(2);
    expect(eventElems.at(0)).toHaveText(names[0]);
    expect(eventElems.at(1)).toHaveText(names[1]);
});
