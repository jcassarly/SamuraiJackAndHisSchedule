const CREATE_EVENT = 'CREATE_EVENT';

function createEvent(event) {
    return {
        type: CREATE_EVENT,
        payload: {
            event,
        },
    };
}

export default createEvent;
export { CREATE_EVENT };
