const MOVE_EVENT = 'MOVE_EVENT';
const CHANGE_START = 'CHANGE_START';
const CHANGE_END = 'CHANGE_END';

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

export { MOVE_EVENT, CHANGE_START, CHANGE_END };
export { moveEvent, changeStart, changeEnd };
