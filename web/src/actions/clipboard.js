const CUT = 'CUT';
const COPY = 'COPY';
const PASTE = 'PASTE';
const SET_MIN = 'SET_MIN';
const SET_DAY = 'SET_DAY';

function cut(id) {
    return {
        type: CUT,
        payload: {
            id,
        },
    };
}

function copy(id) {
    return {
        type: COPY,
        payload: {
            id,
        },
    };
}

function paste(time, type) {
    return {
        type: PASTE,
        payload: {
            time,
            type,
        },
    };
}

export {
    CUT,
    COPY,
    PASTE,
    SET_MIN,
    SET_DAY,
};
export { cut, copy, paste };
