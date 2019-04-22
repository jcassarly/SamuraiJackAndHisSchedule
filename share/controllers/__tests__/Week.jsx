import React from 'react';
import { shallow } from 'enzyme';
import moment from 'moment-timezone';

import { Event } from '../../events/Event';
import Week from '../Week';
import { modes } from '../MainCalendar';

jest.mock('../../../em2px');

const moveEvent = jest.fn(() => {});
const changeStart = jest.fn(() => {});
const changeEnd = jest.fn(() => {});
const cut = jest.fn(() => {});
const copy = jest.fn(() => {});
const paste = jest.fn(() => {});

function createWeek(date, events, mode) {
    return shallow(
        <Week
            week={date}
            events={events}
            mode={mode}
            moveEvent={moveEvent}
            changeStart={changeStart}
            changeEnd={changeEnd}
            cut={cut}
            copy={copy}
            paste={paste}
        />,
    );
}

const date = moment.tz('2019-03-19T08:00:00Z', 'America/New_York');
test('displays days', () => {
    const week = createWeek(date, [], modes.NORMAL);

    expect(week.find('DayController')).toHaveLength(8);
    for (let i = 0; i < 7; i += 1) {
        expect(week.find('DayController').at(i + 1).prop('day').valueOf()).toBe(date.clone().startOf('week').add(i, 'days').valueOf());
    }
    expect(week.find('DayController').at(1)).toHaveProp('mode', modes.NORMAL);
    expect(week.find('DayController').at(0)).toHaveProp('onlyHours', true);
    expect(week.find('DayController').at(1)).toHaveProp('onlyHours', false);
});

test('event handlers', () => {
    expect(moveEvent.mock.calls).toHaveLength(0);
    expect(changeStart.mock.calls).toHaveLength(0);
    expect(changeEnd.mock.calls).toHaveLength(0);
    expect(cut.mock.calls).toHaveLength(0);
    expect(copy.mock.calls).toHaveLength(0);
    expect(paste.mock.calls).toHaveLength(0);

    const day = createWeek(date, [], modes.NORMAL).find('DayController').at(1);

    day.prop('moveEvent')();
    expect(moveEvent.mock.calls).toHaveLength(1);
    day.prop('changeStart')();
    expect(changeStart.mock.calls).toHaveLength(1);
    day.prop('changeEnd')();
    expect(changeEnd.mock.calls).toHaveLength(1);
    day.prop('cut')();
    expect(cut.mock.calls).toHaveLength(1);
    day.prop('copy')();
    expect(copy.mock.calls).toHaveLength(1);
    day.prop('paste')();
    expect(paste.mock.calls).toHaveLength(1);
});

test('notify drag', () => {
    const week = createWeek(date, [], modes.DRAG_DROP);
    const days = week.find('DayController');

    const def = {
        initialFocus: -1,
        focused: -1,
        selectedEvent: null,
        initialPos: 0,
    };

    expect(week.state()).toEqual(expect.objectContaining(def));

    days.at(1).prop('notifyDrag')(() => {
        // should not be called
        expect(true).toBe(false);
    });

    expect(week.state()).toEqual(expect.objectContaining(def));

    days.at(2).prop('notifyDrag')(new Event('test', 'test description',
        date, date.clone().add(3, 'hours')), 10);
    expect(week.state('selectedEvent').name).toBe('test');
    expect(week.state()).toEqual(expect.objectContaining({
        initialFocus: 1,
        focused: 1,
        initialPos: 10,
    }));

    days.at(1).prop('notifyDrag')((selectedEvent, initialPos) => {
        expect(selectedEvent.name).toBe('test');
        expect(initialPos).toBe(10);
    });
    expect(week.state()).toEqual(expect.objectContaining({
        initialFocus: 1,
        focused: 0,
        initialPos: 10,
    }));

    days.at(1).prop('notifyDrag')(false);
    expect(week.state()).toEqual(expect.objectContaining(def));
});
