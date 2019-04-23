const MOVE_EVENT = 'MOVE_EVENT';
const CHANGE_START = 'CHANGE_START';
const CHANGE_END = 'CHANGE_END';
const EDIT_EVENT = 'EDIT_EVENT';

function moveEvent(id, amount, type, snap) {
    return {
        type: MOVE_EVENT,
        payload: {
            id,
            amount,
            type,
            snap,
        },
    };
}

/**
 * Edits an existing event by replacing it with a new one with new fields
 */
function editEvent(
    id,
    name,
    description,
    eventStart,
    eventEnd,
    location,
    locked,
    notifications, // TODO: use notification object here instead
    parent,
    frequency,
    color) {
    return {
        type: EDIT_EVENT,
        payload: {
            id,
            name,
            description,
            eventStart,
            eventEnd,
            location,
            locked,
            notifications,
            parent,
            frequency,
            color,
        },
    };
}


function changeStart(id, start) {
    return {
        type: CHANGE_START,
        payload: {
            id,
            start,
            snap,
        },
    };
}

function changeEnd(id, end, snap) {
    return {
        type: CHANGE_END,
        payload: {
            id,
            end,
            snap,
        },
    };
}

export { MOVE_EVENT, CHANGE_START, CHANGE_END, EDIT_EVENT};
export { moveEvent, changeStart, changeEnd, editEvent};
