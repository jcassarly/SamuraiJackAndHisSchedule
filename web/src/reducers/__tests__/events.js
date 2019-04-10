import moment from 'moment-timezone';
import autoSchedule from '../../events/AutoScheduler';
import reducer from '../events';
import {
    createEvent,
    createDeadlineEvent,
} from '../../actions/createEvent';
import { Event } from '../../events/Event';
import { Deadline } from '../../events/Deadline';

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
