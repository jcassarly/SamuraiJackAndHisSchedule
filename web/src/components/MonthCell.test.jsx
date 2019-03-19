import React from 'react';
import moment from 'moment-timezone';
import { shallow } from 'enzyme';
import MonthCell from './MonthCell';
import { Event } from '../events/Event';

test('renders no-event', () => {
    const cell = shallow(<MonthCell date={5} />);
    expect(cell.find('.monthDay')).toHaveText('5');
});

test('renders with event', () => {
    const eventStart = moment.tz('2019-03-18T02:00:00Z', 'America/New_York');
    console.log(eventStart.format());
    const event = new Event('test', null, eventStart.clone(), eventStart.clone().add(2, 'hours'));
    const cell = shallow(<MonthCell date={5} events={[event]} />);
    expect(cell.find('.monthDay')).toHaveText('5');
    expect(cell.find('.monthEvent')).toHaveText('test');
});
