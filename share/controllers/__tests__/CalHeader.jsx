import React from 'react';
import { shallow } from 'enzyme';
import moment from 'moment-timezone';

import CalHeader from '../CalHeader';
import { types } from '../MainCalendar';

jest.mock('../../../em2px');

const onLeft = jest.fn(() => {});
const onRight = jest.fn(() => {});
const onSwitch = jest.fn(() => {});

function renderCal(type) {
    const date = moment.tz('2019-03-19T08:00:00Z', 'America/New_York');
    return shallow(<CalHeader
        date={date}
        type={type}
        onSwitch={onSwitch}
        onLeft={onLeft}
        onRight={onRight}
    />);
}

test('renders month', () => {
    const header = renderCal(types.MONTH);
    expect(header).toHaveProp('date', 'March');
});

test('renders week', () => {
    const header = renderCal(types.WEEK);
    expect(header).toHaveProp('date', 'Week of Mar 17th');
});

test('renders day', () => {
    const header = renderCal(types.DAY);
    expect(header).toHaveProp('date', 'Mar 19th (Tue)');
});

test('click handlers', () => {
    const header = renderCal(types.MONTH);
    header.prop('onLeft')();
    header.prop('onRight')();
    header.prop('onSwitch')();

    expect(onLeft.mock.calls).toHaveLength(1);
    expect(onRight.mock.calls).toHaveLength(1);
    expect(onSwitch.mock.calls).toHaveLength(1);
});
