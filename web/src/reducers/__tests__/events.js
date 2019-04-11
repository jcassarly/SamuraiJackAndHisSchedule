/* eslint-disable max-len */
import moment from 'moment-timezone';
import autoSchedule from '../../events/AutoScheduler';
import reducer from '../events';
import {
    createEvent,
    createDeadlineEvent,
} from '../../actions/createEvent';
import { Event } from '../../events/Event';
import { Deadline } from '../../events/Deadline';
// import { syncFrom, syncFromAsync } from '../../actions/sync';

jest.mock('../../events/AutoScheduler');

const state = {
    maxEventId: 0,
    events: {},
    maxDeadlineId: 0,
    deadlines: {},
};
// note, do not change to original=state, must be independent copies
const originalState = {
    maxEventId: 0,
    events: {},
    maxDeadlineId: 0,
    deadlines: {},
};
const eventTime = moment.tz('2019-03-19T08:00:00Z', 'America/New_York');
const event = new Event('test', 'description', eventTime.clone(), eventTime.clone().add(1, 'hour'));
const deadline = new Deadline('test', eventTime.clone().add(10, 'days'), 360, 10, 60, 10, eventTime.clone().add(2, 'hours'), 10, eventTime.clone());

test('keeps state', () => {
    expect(reducer(state)).toEqual(state);
});

test('add event', () => {
    const action = createEvent(event);
    const result = reducer(state, action);
    const resultEvs = Object.values(result.events);
    expect(resultEvs).toContain(event);
    expect(resultEvs).toHaveLength(1);
});

test('broken autoscheduler doesn\'t clobber user data', () => {
    let result = reducer(state, createEvent(event));

    const action = createDeadlineEvent(deadline);
    autoSchedule.mockReturnValueOnce([]);
    result = reducer(result, action);
    let resultEvs = Object.values(result.events);
    expect(resultEvs).toContain(event);
    expect(resultEvs).toHaveLength(1);

    autoSchedule.mockReturnValueOnce(6);
    result = reducer(result, action);
    resultEvs = Object.values(result.events);
    expect(resultEvs).toContain(event);
    expect(resultEvs).toHaveLength(1);

    autoSchedule.mockReturnValueOnce(undefined);
    result = reducer(result, action);
    resultEvs = Object.values(result.events);
    expect(resultEvs).toContain(event);
    expect(resultEvs).toHaveLength(1);
});

test('add deadline event', () => {
    /**
     * don't need to worry about technically invalid autoscheduling
     * reducer assumes autoscheduler gives a valid schedule
     * assuming it passes basic sanity checks like the length of the array
     */
    autoSchedule.mockReturnValueOnce([
        event,
    ]);

    const action = createDeadlineEvent(deadline);
    const result = reducer(state, action);
    const resultEvs = Object.values(result.events);
    expect(resultEvs).toContain(event);
    expect(resultEvs).toHaveLength(1);
});

test('state is never mutated', () => {
    expect(state).toEqual(originalState);
});

// WIP
/* test('changes deadlines and events on sync', () => {
    // create test data (one deadline and one event in this)
    // I know theres a big block of text here, but i think its better to use real data than fake data that wont ever get used when this app runs
    const eventsJson = {
        0: '{"type":"event","obj":{"id":"0","name":"one","description":"","startTime":"2019-04-11T02:38:38.913Z","endTime":"2019-04-11T03:38:38.913Z","location":"","locked":true,"notifications":"","parent":-1}}',
        1: '{"type":"event","obj":{"id":"1","name":"deadline","startTime":"2019-04-11T13:40:19.301Z","endTime":"2019-04-11T14:00:19.301Z","location":"","locked":false,"parent":"1"}}',
        2: '{"type":"event","obj":{"id":"2","name":"deadline","startTime":"2019-04-29T13:40:19.301Z","endTime":"2019-04-29T14:00:19.301Z","location":"","locked":false,"parent":"1"}}',
        3: '{"type":"event","obj":{"id":"3","name":"deadline","startTime":"2019-04-12T13:40:19.301Z","endTime":"2019-04-12T14:00:19.301Z","location":"","locked":false,"parent":"1"}}',
        4: '{"type":"event","obj":{"id":"4","name":"deadline","startTime":"2019-04-16T13:40:19.301Z","endTime":"2019-04-16T14:00:19.301Z","location":"","locked":false,"parent":"1"}}',
        5: '{"type":"event","obj":{"id":"5","name":"deadline","startTime":"2019-04-24T13:40:19.301Z","endTime":"2019-04-24T14:00:19.301Z","location":"","locked":false,"parent":"1"}}',
        6: '{"type":"event","obj":{"id":"6","name":"deadline","startTime":"2019-04-23T13:40:19.301Z","endTime":"2019-04-23T14:00:19.301Z","location":"","locked":false,"parent":"1"}}',
        7: '{"type":"event","obj":{"id":"7","name":"deadline","startTime":"2019-04-15T13:40:19.301Z","endTime":"2019-04-15T14:00:19.301Z","location":"","locked":false,"parent":"1"}}',
        8: '{"type":"event","obj":{"id":"8","name":"deadline","startTime":"2019-04-22T13:40:19.301Z","endTime":"2019-04-22T14:00:19.301Z","location":"","locked":false,"parent":"1"}}',
        9: '{"type":"event","obj":{"id":"9","name":"deadline","startTime":"2019-04-21T13:40:19.301Z","endTime":"2019-04-21T14:00:19.301Z","location":"","locked":false,"parent":"1"}}',
        10: '{"type":"event","obj":{"id":"10","name":"deadline","startTime":"2019-04-13T13:40:19.301Z","endTime":"2019-04-13T14:00:19.301Z","location":"","locked":false,"parent":"1"}}',
        11: '{"type":"event","obj":{"id":"11","name":"deadline","startTime":"2019-04-14T13:40:19.301Z","endTime":"2019-04-14T14:00:19.301Z","location":"","locked":false,"parent":"1"}}',
        12: '{"type":"event","obj":{"id":"12","name":"deadline","startTime":"2019-04-20T13:40:19.301Z","endTime":"2019-04-20T14:00:19.301Z","location":"","locked":false,"parent":"1"}}',
        13: '{"type":"event","obj":{"id":"13","name":"deadline","startTime":"2019-04-19T13:40:19.301Z","endTime":"2019-04-19T14:00:19.301Z","location":"","locked":false,"parent":"1"}}',
        14: '{"type":"event","obj":{"id":"14","name":"deadline","startTime":"2019-04-18T13:40:19.301Z","endTime":"2019-04-18T14:00:19.301Z","location":"","locked":false,"parent":"1"}}',
        15: '{"type":"event","obj":{"id":"15","name":"deadline","startTime":"2019-04-17T13:40:19.301Z","endTime":"2019-04-17T14:00:19.301Z","location":"","locked":false,"parent":"1"}}',
    };

    const deadlinesJson = {
        1: '{"id":"1","name":"deadline","createdEvents":[null,"1","2","3","4","5","6","7","8","9","10","11","12","13","14","15"],"deadline":"2019-04-30T03:40:19.301Z","startWorkTime":"2019-04-11T02:40:19.301Z","totalWorkTime":"300","minEventTime":"15","maxEventTime":"20","minBreak":"5","location":""}',
    };

    const settingsJson = {
        eventLength: 60,
        defaultLocation: 'anywhere',
        defaultNotificationTimeBefore: 'email',
        defaultNotificationType: 15,
        locked: true,
        language: 'English',
        snapToGrid: 15,
        timeBeforeDue: 168,
        minWorkTime: 15,
        maxWorkTime: 120,
        minBreakTime: 15,
        timeToComplete: 42,
    };

    const evt = new Event(
        'one',
        '',
        moment('2019-04-11T02:38:38.913Z'),
        moment('2019-04-11T03:38:38.913Z'),
        '',
        true,
        '',
        -1,
    );

    const ddln = new Deadline(
        'deadline',
        moment('2019-04-30T03:40:19.301Z'),
        '300',
        '15',
        '20',
        '5',
        moment('2019-04-11T02:40:19.301Z'),
        '',
    );

    const schedule = autoSchedule(
        { events: { 0: evt } },
        ddln,
        eventTime.hour(9),
        eventTime.hour(17),
    );

    // set the ids
    Object.keys(schedule).forEach((key) => {
        schedule[key].id = key;
    });

    const action = syncFrom(eventsJson, deadlinesJson, settingsJson);
    const result = reducer(state, action);
    expect(result.events.events).toEqual({ ...schedule });
    expect(result.events.deadlines).toEqual({ 1: ddln });
}); */
