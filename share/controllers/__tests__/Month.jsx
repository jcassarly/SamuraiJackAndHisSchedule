import React from 'react';
import { shallow } from 'enzyme';
import moment from 'moment-timezone';
import Month from '../Month';
import { Event } from '../../events/Event';

jest.mock('../../../em2px');

const navEditEvent = jest.fn(() => {});
const date = moment.tz('2019-03-19T08:00:00Z', 'America/New_York');
test('renders a month normally', () => {
    const month = shallow(<Month month={date} navEditEvent={navEditEvent} events={[]} />);
    expect(month.find('MonthCell')).toHaveLength(126);
    expect(month.find('MonthCell[current=true]')).toHaveLength(31);
    expect(month.find('MonthCell[current=true]').at(0).prop('date')).toBe(1);
});

test('renders a month with an event', () => {
    const events = [
        new Event('test', 'test description',
            date, date.clone().add(3, 'hours')),
    ];
    const month = shallow(<Month month={date} navEditEvent={navEditEvent} events={events} />);
    expect(month.find('MonthCell[current=true]').at(18).prop('events')).toHaveLength(1);
    expect(month.find('MonthCell[current=true]').at(18).prop('events')).toContain(events[0]);
    expect(month.find('MonthCell[current=true]').at(19).prop('events')).toHaveLength(0);
    expect(month.find('MonthCell[current=true]').at(17).prop('events')).toHaveLength(0);
});
