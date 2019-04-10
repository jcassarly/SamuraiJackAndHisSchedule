const MOVE_EVENT = 'MOVE_EVENT';

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

export { MOVE_EVENT };
export { moveEvent };
