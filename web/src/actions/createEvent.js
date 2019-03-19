const CREATE_EVENT = 'CREATE_EVENT';
const CREATE_DEADLINE_EVENT = 'CREATE_DEADLINE_EVENT';

function createEvent(event) {
    return {
        type: CREATE_EVENT,
        payload: {
            event,
        },
    };
}

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
