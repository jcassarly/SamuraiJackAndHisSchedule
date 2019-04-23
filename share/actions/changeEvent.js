const MOVE_EVENT = 'MOVE_EVENT';
const CHANGE_START = 'CHANGE_START';
const CHANGE_END = 'CHANGE_END';

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

function changeStart(id, start, snap) {
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

export { MOVE_EVENT, CHANGE_START, CHANGE_END };
export { moveEvent, changeStart, changeEnd };
