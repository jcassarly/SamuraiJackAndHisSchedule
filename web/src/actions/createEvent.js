// action type constants

// add a new event to the calendar
const CREATE_EVENT = 'CREATE_EVENT';
// add a new deadline event to the calendar
const CREATE_DEADLINE_EVENT = 'CREATE_DEADLINE_EVENT';
// sets the event and deadline lists to new ones in the calendar
const SET_LISTS = 'SET_LISTS';

/**
 * action creator
 * creates an action corresponding to adding a new event to the calendar
 * @param {Event} the event to add to the calendar
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
 * @param {Deadline} the deadline event to add to the calendar
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

/**
 * action creator
 * creates an action corresponding to setting the deadline and event lists
 * @param {Event[]} events
 * @param {Deadline[]} deadlines
 * Returns the action
 */
function setLists(events, deadlines) {
    return {
        type: SET_LISTS,
        payload: {
            events,
            deadlines,
        },
    };
}

export { createEvent, createDeadlineEvent, setLists };
export { CREATE_EVENT, CREATE_DEADLINE_EVENT, SET_LISTS };
