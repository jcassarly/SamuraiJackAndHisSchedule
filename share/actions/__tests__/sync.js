import {
    syncFrom,
    SYNC_FROM,
} from '../sync';

test('sync from action creator', () => {
    // create values to pass into the action creator
    const eventsJson = {};
    const deadlinesJson = {};
    const settingsJson = '{"eventLength":60,"defaultLocation":"anywhere","defaultNotificationTimeBefore":15,"defaultNotificationType":"email","locked":true,"timeBeforeDue":168,"minWorkTime":15,"maxWorkTime":120,"minBreakTime":15,"timeToComplete":42}';

    // create the expected result
    const createAction = {
        type: SYNC_FROM,
        payload: {
            eventsJson,
            deadlinesJson,
            settingsJson,
        },
    };

    // check that the syncFrom creates the correct aciton creator
    expect(syncFrom(eventsJson, deadlinesJson, settingsJson)).toEqual(createAction);
});
