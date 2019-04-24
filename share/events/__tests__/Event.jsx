import { Event, RecurringEvent } from '../Event';
import Notifications from '../Notifications';
import { Deadline } from '../Deadline';
import ColorEnum from '../../ColorEnum';

const moment = require('moment-timezone');

moment().format();
const start = moment('2010-10-20 4:30', 'YYYY-MM-DD HH:mm');
const end = moment('2010-10-22 10:30', 'YYYY-MM-DD HH:mm');
const start2 = moment('2010-10-25 4:30', 'YYYY-MM-DD HH:mm');
const end2 = moment('2010-10-28 10:30', 'YYYY-MM-DD HH:mm');
const start3 = moment('2010-10-20 3:30', 'YYYY-MM-DD HH:mm');
const end3 = moment('2010-10-22 9:30', 'YYYY-MM-DD HH:mm');
const start4 = moment('2019-10-20 4:30', 'YYYY-MM-DD HH:mm');
const end4 = moment('2019-10-21 3:30', 'YYYY-MM-DD HH:mm');
const notify = new Notifications('email', 15, start);
const notes = new Array(notify);
const color = ColorEnum.BLUE_WHITE;
const startWork = moment('2010-10-20 1:30', 'YYYY-MM-DD HH:mm');
const deadlineTime = moment('2010-10-20 4:30', 'YYYY-MM-DD HH:mm');
const deadline = new Deadline('deadline', 'desc', deadlineTime, 42, 30, 60, 15, startWork, 'all over');

test('name works', () => {
    const event = new Event('test', 'desctest', start, end, 'nowhere', true, notes, null);
    expect(event.name).toBe('test');
});

test('description works', () => {
    const event = new Event('test', 'desctest', start, end, 'nowhere', true, notes, null);
    expect(event.description).toBe('desctest');
});

test('startTime works', () => {
    const event = new Event('test', 'desctest', start, end, 'nowhere', true, notes, null);
    expect(start.isSame(event.startTime)).toBe(true);
});

test('endTime works', () => {
    const event = new Event('test', 'desctest', start, end, 'nowhere', true, notes, null);
    expect(end.isSame(event.endTime)).toBe(true);
});

test('location works', () => {
    const event = new Event('test', 'desctest', start, end, 'nowhere', true, notes, null);
    expect(event.location).toBe('nowhere');
});

test('locked works', () => {
    const event = new Event('test', 'desctest', start, end, 'nowhere', true, notes, null);
    expect(event.locked).toBe(true);
});

test('Notifications works', () => {
    const event = new Event('test', 'desctest', start, end, 'nowhere', true, notes, null);
    expect(event.notifications).toBe(notes);
});

test('parent works', () => {
    const event = new Event('test', 'desctest', start, end, 'nowhere', true, notes, deadline);
    expect(event.parent).toBe(deadline);
});

test('overlap works', () => {
    const event = new Event('test', 'desctest', start, end, 'nowhere', true, notes, deadline);
    const event2 = new Event('test', 'desctest', start2, end2, 'nowhere', true, notes, deadline);
    const event3 = new Event('test', 'desctest', start3, end3, 'nowhere', true, notes, deadline);
    expect(event.overlap(event)).toBe(true);
    expect(event.overlap(event3)).toBe(true);
    expect(event.overlap(event2)).toBe(false);
    expect(event2.overlap(event)).toBe(false);
});

function expectAllOverlap(event, recurringEventList) {
    recurringEventList.forEach((evt) => {
        expect(evt.overlap(event)).toBe(true);
    });
}

function expectAllCombosOverlap(eventList) {
    eventList.forEach((event) => {
        eventList.forEach((other) => {
            expect(event.overlap(other)).toBe(true);
        });
    });
}

test('recurring overlap works', () => {
    const event = new Event('test', 'desctest', start, end, 'nowhere', true, notes, deadline);
    const event2 = new Event('test', 'desctest', start2, end2, 'nowhere', true, notes, deadline);
    const event3 = new Event('test', 'desctest', start3, end3, 'nowhere', true, notes, deadline);
    const event4 = new Event('test', 'desctest', start4, end4, 'nowhere', true, notes, deadline);
    // eslint-disable-next-line no-unused-vars
    expect(() => { const event = new RecurringEvent('test', 'desctest', start, end, 'nowhere', true, notes, color, 'daily'); }).toThrow();
    const weeklyEvent = new RecurringEvent('test', 'desctest', start, end, 'nowhere', true, notes, color, 'weekly');
    const monthlyEvent = new RecurringEvent('test', 'desctest', start, end, 'nowhere', true, notes, color, 'monthly');
    const yearlyEvent = new RecurringEvent('test', 'desctest', start, end, 'nowhere', true, notes, color, 'yearly');

    expectAllCombosOverlap([weeklyEvent, monthlyEvent, yearlyEvent]);

    expectAllOverlap(event, [weeklyEvent, monthlyEvent, yearlyEvent]);

    expect(weeklyEvent.overlap(event2)).toBe(true);
    expect(monthlyEvent.overlap(event2)).toBe(false);
    expect(yearlyEvent.overlap(event2)).toBe(false);

    expectAllOverlap(event3, [weeklyEvent, monthlyEvent, yearlyEvent]);

    expect(weeklyEvent.overlap(event4)).toBe(false);
    expect(monthlyEvent.overlap(event4)).toBe(true);
    expect(yearlyEvent.overlap(event4)).toBe(true);

    // eslint-disable-next-line no-unused-vars
    expect(() => { const event = new RecurringEvent('test', 'desctest', start2, end2, 'nowhere', true, notes, color, 'daily'); }).toThrow();
    const weeklyEvent2 = new RecurringEvent('test', 'desctest', start2, end2, 'nowhere', true, notes, color, 'weekly');
    const monthlyEvent2 = new RecurringEvent('test', 'desctest', start2, end2, 'nowhere', true, notes, color, 'monthly');
    const yearlyEvent2 = new RecurringEvent('test', 'desctest', start2, end2, 'nowhere', true, notes, color, 'yearly');

    expectAllCombosOverlap([weeklyEvent2, monthlyEvent2, yearlyEvent2]);

    expect(weeklyEvent2.overlap(event)).toBe(false); // event is before weeklyEvent2 starts
    expect(monthlyEvent2.overlap(event)).toBe(false);
    expect(yearlyEvent2.overlap(event)).toBe(false);

    expectAllOverlap(event2, [weeklyEvent2, monthlyEvent2, yearlyEvent2]);

    expect(weeklyEvent2.overlap(event3)).toBe(false); // event is before weeklyEvent2 starts
    expect(monthlyEvent2.overlap(event3)).toBe(false);
    expect(yearlyEvent2.overlap(event3)).toBe(false);

    expect(weeklyEvent2.overlap(event4)).toBe(false);
    expect(monthlyEvent2.overlap(event4)).toBe(false);
    expect(yearlyEvent2.overlap(event4)).toBe(false);

    // eslint-disable-next-line no-unused-vars
    expect(() => { const event = new RecurringEvent('test', 'desctest', start3, end3, 'nowhere', true, notes, color, 'daily'); }).toThrow();
    const weeklyEvent3 = new RecurringEvent('test', 'desctest', start3, end3, 'nowhere', true, notes, color, 'weekly');
    const monthlyEvent3 = new RecurringEvent('test', 'desctest', start3, end3, 'nowhere', true, notes, color, 'monthly');
    const yearlyEvent3 = new RecurringEvent('test', 'desctest', start3, end3, 'nowhere', true, notes, color, 'yearly');

    expectAllCombosOverlap([weeklyEvent3, monthlyEvent3, yearlyEvent3]);

    expectAllOverlap(event, [weeklyEvent3, monthlyEvent3, yearlyEvent3]);

    expect(weeklyEvent3.overlap(event2)).toBe(true);
    expect(monthlyEvent3.overlap(event2)).toBe(false);
    expect(yearlyEvent3.overlap(event2)).toBe(false);

    expectAllOverlap(event3, [weeklyEvent3, monthlyEvent3, yearlyEvent3]);

    expect(weeklyEvent3.overlap(event4)).toBe(false);
    expect(monthlyEvent3.overlap(event4)).toBe(true);
    expect(yearlyEvent3.overlap(event4)).toBe(true);

    const dailyEvent4 = new RecurringEvent('test', 'desctest', start4, end4, 'nowhere', true, notes, color, 'daily');
    const weeklyEvent4 = new RecurringEvent('test', 'desctest', start4, end4, 'nowhere', true, notes, color, 'weekly');
    const monthlyEvent4 = new RecurringEvent('test', 'desctest', start4, end4, 'nowhere', true, notes, color, 'monthly');
    const yearlyEvent4 = new RecurringEvent('test', 'desctest', start4, end4, 'nowhere', true, notes, color, 'yearly');

    expectAllCombosOverlap([dailyEvent4, weeklyEvent4, monthlyEvent4, yearlyEvent4]);

    // events 1-3 are all before _____lyEvent4
    expect(dailyEvent4.overlap(event)).toBe(false);
    expect(weeklyEvent4.overlap(event)).toBe(false);
    expect(monthlyEvent4.overlap(event)).toBe(false);
    expect(yearlyEvent4.overlap(event)).toBe(false);

    expect(dailyEvent4.overlap(event2)).toBe(false);
    expect(weeklyEvent4.overlap(event2)).toBe(false);
    expect(monthlyEvent4.overlap(event2)).toBe(false);
    expect(yearlyEvent4.overlap(event2)).toBe(false);

    expect(dailyEvent4.overlap(event3)).toBe(false);
    expect(weeklyEvent4.overlap(event3)).toBe(false);
    expect(monthlyEvent4.overlap(event3)).toBe(false);
    expect(yearlyEvent4.overlap(event3)).toBe(false);

    expectAllOverlap(event4, [dailyEvent4, weeklyEvent4, monthlyEvent4, yearlyEvent4]);
});
