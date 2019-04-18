import React from 'react';
import { shallow } from 'enzyme';
import moment from 'moment-timezone';

import CalHeader from '../CalHeader';

jest.mock('../../em2px');

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
    const header = renderCal('month');
    expect(header.childAt(1)).toHaveText('March');
});

test('renders week', () => {
    const header = renderCal('week');
    expect(header.childAt(1)).toHaveText('Week of Mar 17th');
});

test('renders day', () => {
    const header = renderCal('day');
    expect(header.childAt(1)).toHaveText('Mar 19th (Tue)');
});

test('click handlers', () => {
    const header = renderCal('month');
    for (let i = 0; i < 3; i += 1) {
        header.childAt(i).simulate('click');
    }
    expect(onLeft.mock.calls).toHaveLength(1);
    expect(onRight.mock.calls).toHaveLength(1);
    expect(onSwitch.mock.calls).toHaveLength(1);
});
