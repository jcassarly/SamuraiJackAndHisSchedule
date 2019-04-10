// import Cookie from 'js-cookie';
import request from 'superagent';

const SYNC_FROM = 'SYNC_FROM';


/**
 * action creator
 * sets the events and deadlines lists in the redux store
 * @param {Event[]} events the new events list with elements still as strings
 * @param {Deadline[]} deadlines the new deadlines list with elements still as strings
 * @param {Settings} settings the new settings as a JSON string
 */
function syncFrom(eventsJson, deadlinesJson, settingsJson) {
    return {
        type: SYNC_FROM,
        payload: {
            eventsJson,
            deadlinesJson,
            settingsJson,
        },
    };
}

/**
 * asynchronous action creator
 * this function is redux thunk
 * returns a function that handles getting the syncing from the server
 */
function syncFromAsync() {
    return (dispatch) => {
        request
            .get('http://127.0.0.1:8000/proto/get') // TODO: remove hardcoded URL
            .then((res) => {
                // create the JSON object from the string received
                const parsed = JSON.parse(res.text);

                console.log(parsed.events);
                console.log(parsed.deadlines);
                console.log(JSON.stringify(parsed.settings));

                // add the new events and deadlines from the server to the redux store
                dispatch(syncFrom(
                    parsed.events,
                    parsed.deadlines,
                    // convert back to string because syncFrom expects a string
                    JSON.stringify(parsed.settings),
                ));
            });
    };
}

export { syncFrom, syncFromAsync };
export { SYNC_FROM };
