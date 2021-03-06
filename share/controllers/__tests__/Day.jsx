import React from 'react';
import { mount } from 'enzyme';
import createStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import moment from 'moment-timezone';

import { Settings } from '../../events/Settings';
import { Event } from '../../events/Event';
import Day from '../Day';
import { modes } from '../MainCalendar';
import { SET_MIN } from '../../actions/clipboard';

jest.mock('../../../em2px');

const moveEvent = jest.fn(() => {});
const changeStart = jest.fn(() => {});
const changeEnd = jest.fn(() => {});
const cut = jest.fn(() => {});
const copy = jest.fn(() => {});
const paste = jest.fn(() => {});
const notifyDrag = jest.fn(() => {});
const navEditEvent = jest.fn(() => {});

const nonDaylight = moment.tz('2019-03-19T08:00:00Z', 'America/New_York');
const daylight = moment.tz('2019-03-10T08:00:00Z', 'America/New_York');

const event = new Event('test', 'test description',
    nonDaylight, nonDaylight.clone().add(3, 'hours'));
event.id = 10;

const store = createStore()({
    settings: {
        settings: new Settings(),
    },
});
function createDay(day, events, mode) {
    return mount(
        <Provider store={store}>
            <Day
                navEditEvent={navEditEvent}
                day={day}
                events={events}
                mode={mode}
                moveEvent={moveEvent}
                changeStart={changeStart}
                changeEnd={changeEnd}
                cut={cut}
                copy={copy}
                paste={paste}
                notifyDrag={notifyDrag}
            />
        </Provider>,
    ).find('DayController').at(0);
}

test('generateHours func', () => {
    const genedHours = Day.generateHours(nonDaylight);
    for (let i = 0; i < 24; i += 1) {
        expect(genedHours[i].hour).toBe(i);
    }
});

test('generateHours on daylight', () => {
    const genedHours = Day.generateHours(daylight);
    expect(genedHours).toHaveLength(23);
});

test('bool vals', () => {
    let day = createDay(nonDaylight, [], modes.NORMAL).find('Day').at(0);
    expect(day).toHaveProp('tool', false);
    expect(day).toHaveProp('pasting', false);
    expect(day).toHaveProp('resizing', false);

    day = createDay(nonDaylight, [], modes.DRAG_DROP).find('Day').at(0);
    expect(day).toHaveProp('tool', true);
    expect(day).toHaveProp('pasting', false);
    expect(day).toHaveProp('resizing', false);

    day = createDay(nonDaylight, [], modes.PASTE).find('Day').at(0);
    expect(day).toHaveProp('tool', false);
    expect(day).toHaveProp('pasting', true);
    expect(day).toHaveProp('resizing', false);

    day = createDay(nonDaylight, [], modes.RESIZE).find('Day').at(0);
    expect(day).toHaveProp('tool', false);
    expect(day).toHaveProp('pasting', false);
    expect(day).toHaveProp('resizing', true);
});

test('copy', () => {
    const day = createDay(nonDaylight, [event], modes.COPY).find('Day').at(0);

    expect(copy.mock.calls).toHaveLength(0);
    day.prop('clipClose')(event)();
    expect(copy.mock.calls).toHaveLength(1);
    expect(copy.mock.calls[0]).toEqual([event.id]);
});

test('cut', () => {
    const day = createDay(nonDaylight, [event], modes.CUT).find('Day').at(0);

    expect(cut.mock.calls).toHaveLength(0);
    day.prop('clipClose')(event)();
    expect(cut.mock.calls).toHaveLength(1);
    expect(cut.mock.calls[0]).toEqual([event.id]);
});

test('paste', () => {
    const day = createDay(nonDaylight, [event], modes.PASTE).find('Day').at(0);

    expect(paste.mock.calls).toHaveLength(0);
    day.prop('pasteClose')(x => x, () => 5.5)();
    expect(paste.mock.calls).toHaveLength(1);
    expect(paste.mock.calls[0][0].hour()).toBe(5);
    expect(paste.mock.calls[0][0].minute()).toBe(30);
    expect(paste.mock.calls[0][1]).toBe(SET_MIN);
});

test('resize', () => {
    const day = createDay(nonDaylight, [event], modes.RESIZE);

    expect(changeStart.mock.calls).toHaveLength(0);
    expect(changeEnd.mock.calls).toHaveLength(0);
    day.find('Day').at(0).prop('resizeClose')(() => 5)(event, true)();
    expect(day.state('selectedEvent').id).toBe(event.id);
    expect(day).toHaveState('initialPos', 5);
    expect(day).toHaveState('startSelected', true);

    day.find('Day').at(0).prop('mouseMoveClose')(() => 6, () => true)();
    expect(day).toHaveState('mouseMove', 1);

    day.find('Day').at(0).prop('mouseMoveClose')(() => 4, () => true)();
    expect(day).toHaveState('mouseMove', -1);

    day.find('Day').at(0).prop('mouseUpClose')(x => x, () => true)();
    expect(changeStart.mock.calls).toHaveLength(1);
    expect(changeStart.mock.calls[0][0]).toBe(event.id);
    expect(changeStart.mock.calls[0][1].hour()).toBe(event.startTime.hour() - 1);

    // resize end time
    day.find('Day').at(0).prop('resizeClose')(() => 5)(event, false)();
    expect(day).toHaveState('startSelected', false);
    day.find('Day').at(0).prop('mouseMoveClose')(() => 6, () => true)();
    expect(day).toHaveState('mouseMove', 1);
    day.find('Day').at(0).prop('mouseUpClose')(x => x, () => true)();
    expect(changeEnd.mock.calls).toHaveLength(1);
    expect(changeEnd.mock.calls[0][0]).toBe(event.id);
    expect(changeEnd.mock.calls[0][1].hour()).toBe(event.endTime.hour() + 1);
});

test('drag-drop', () => {
    let day = createDay(nonDaylight, [event], modes.DRAG_DROP);

    expect(moveEvent.mock.calls).toHaveLength(0);
    notifyDrag.mockClear();
    day.find('Day').at(0).prop('mouseMoveClose')(() => 5, () => {})();
    expect(notifyDrag.mock.calls).toHaveLength(1);
    notifyDrag.mock.calls[0][0](event, 4);
    expect(day.state('selectedEvent').id).toBe(event.id);
    expect(day.state('initialPos')).toBe(4);
    expect(day.state('mouseMove')).toBe(1);

    day = createDay(nonDaylight, [event], modes.DRAG_DROP);
    day.find('Day').at(0).prop('dragClose')(() => 5, () => true)(event)();
    expect(day.state('selectedEvent').id).toBe(event.id);
    expect(day).toHaveState('initialPos', 5);
    expect(notifyDrag.mock.calls).toHaveLength(2);

    day.find('Day').at(0).prop('mouseMoveClose')(() => 6, () => {})();
    expect(notifyDrag.mock.calls).toHaveLength(2);
    expect(day).toHaveState('mouseMove', 1);
    day.find('Day').at(0).prop('mouseUpClose')(x => x, () => {})();
    expect(moveEvent.mock.calls).toHaveLength(2);
    expect(moveEvent.mock.calls[1]).toEqual(expect.arrayContaining([
        event.id,
        60,
        'minutes',
    ]));
});
