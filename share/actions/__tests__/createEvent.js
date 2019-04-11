import moment from 'moment-timezone';
import {
    createEvent,
    createDeadlineEvent,
    CREATE_EVENT,
    CREATE_DEADLINE_EVENT,
} from '../createEvent';
import { Event } from '../../events/Event';
import { Deadline } from '../../events/Deadline';

const eventTime = moment.tz('2019-03-19T08:00:00Z', 'America/New_York');

test('create event action creator', () => {
    const event = new Event('test', 'description', eventTime.clone(), eventTime.clone().add(2, 'hours'));
    const createAction = {
        type: CREATE_EVENT,
        payload: {
            event,
        },
    };
    expect(createEvent(event)).toEqual(createAction);
});

test('create deadline event action creator', () => {
    const deadline = new Deadline('test', eventTime.clone().add(10, 'days'), 360, 10, 60, 10, eventTime.clone().add(2, 'hours'), 10, eventTime.clone());
    const createAction = {
        type: CREATE_DEADLINE_EVENT,
        payload: {
            deadline,
        },
    };
    expect(createDeadlineEvent(deadline)).toEqual(createAction);
});
