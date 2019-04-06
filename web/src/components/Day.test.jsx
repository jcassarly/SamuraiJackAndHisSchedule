// import React from 'react';
import { shallow } from 'enzyme';
import moment from 'moment-timezone';
import Day from './Day';

const nonDaylight = moment.tz('2019-03-19T08:00:00Z', 'America/New_York');
test('generateHours func', () => {
    // const day = shallow(<Day day={nonDaylight} events={[]} />)
    const genedHours = Day.generateHours(nonDaylight);
    for (let i = 0; i < 24; i += 1) {
        expect(shallow(genedHours[2 * i])).toHaveText(i.toString());
    }
});

test('renders no-event no-daylight', () => {
});
