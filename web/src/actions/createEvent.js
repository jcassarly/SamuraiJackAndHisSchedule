// action type constants

// add a new event to the calendar
const CREATE_EVENT = 'CREATE_EVENT';
// add a new deadline event to the calendar
const CREATE_DEADLINE_EVENT = 'CREATE_DEADLINE_EVENT';

/**
 * action creator
 * creates an action corresponding to adding a new event to the calendar
 * @param {event} the event to add to the calendar
 * Returns the action
 */
function createEvent(event) {
    return {
        type: CREATE_EVENT,
        payload: {
            event,
        },
    };
}

/**
 * action creator
 * creates an action corresponding to adding a new deadline event to the calendar
 * @param {deadline} the deadline event to add to the calendar
 * Returns the action
 */
function createDeadlineEvent(deadline) {
    return {
        type: CREATE_DEADLINE_EVENT,
        payload: {
            deadline,
        },
    };
}

export { createEvent, createDeadlineEvent };
export { CREATE_EVENT, CREATE_DEADLINE_EVENT };
