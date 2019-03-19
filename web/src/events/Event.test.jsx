import { Event } from './Event';
import Notifications from './Notifications';
import Deadline from './Deadline';

const moment = require('moment-timezone');

moment().format();
const start = moment('2010-10-20 4:30', 'YYYY-MM-DD HH:mm');
const end = moment('2010-10-22 10:30', 'YYYY-MM-DD HH:mm');
const start2 = moment('2010-10-25 4:30', 'YYYY-MM-DD HH:mm');
const end2 = moment('2010-10-28 10:30', 'YYYY-MM-DD HH:mm');
const start3 = moment('2010-10-20 3:30', 'YYYY-MM-DD HH:mm');
const end3 = moment('2010-10-22 9:30', 'YYYY-MM-DD HH:mm');
const notify = new Notifications('email', 15, start);
const notes = new Array(notify);
const startWork = moment('2010-10-20 1:30', 'YYYY-MM-DD HH:mm');
const deadlineTime = moment('2010-10-20 4:30', 'YYYY-MM-DD HH:mm');
const deadline = new Deadline('deadline', deadlineTime, 42, 30, 60, 15, startWork, 'all over');

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
    expect(Event.overlap(event, event3)).toBe(true);
    expect(Event.overlap(event, event2)).toBe(false);
    expect(Event.overlap(event2, event)).toBe(false);
});
