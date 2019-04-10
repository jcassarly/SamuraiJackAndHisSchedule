import {
    syncFrom,
    SYNC_FROM,
} from '../sync';

test('sync from action creator', () => {
    const eventsJson = {};
    const deadlinesJson = {};
    const settingsJson = '{"eventLength":60,"defaultLocation":"anywhere","defaultNotificationTimeBefore":15,"defaultNotificationType":"email","locked":true,"timeBeforeDue":168,"minWorkTime":15,"maxWorkTime":120,"minBreakTime":15,"timeToComplete":42}';
    const createAction = {
        type: SYNC_FROM,
        payload: {
            eventsJson,
            deadlinesJson,
            settingsJson,
        },
    };
    expect(syncFrom(eventsJson, deadlinesJson, settingsJson)).toEqual(createAction);
});
