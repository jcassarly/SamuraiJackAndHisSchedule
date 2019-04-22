const MOVE_EVENT = 'MOVE_EVENT';
const CHANGE_START = 'CHANGE_START';
const CHANGE_END = 'CHANGE_END';
const EDIT_EVENT = 'EDIT_EVENT';

function moveEvent(id, amount, type) {
    return {
        type: MOVE_EVENT,
        payload: {
            id,
            amount,
            type,
        },
    };
}

function editEvent(id, 
    name,
    description,
    eventStart,
    eventEnd,
    location,
    locked,
    notifications, // TODO: use notification object here instead
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
        },
    };
}

function changeEnd(id, end) {
    return {
        type: CHANGE_END,
        payload: {
            id,
            end,
        },
    };
}

export { MOVE_EVENT, CHANGE_START, CHANGE_END, EDIT_EVENT};
export { moveEvent, changeStart, changeEnd, editEvent};
