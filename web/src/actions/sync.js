import Cookie from 'js-cookie';
import request from 'superagent';
import { deserialize } from '../events/Event';
import { deserializeDeadline } from '../events/Deadline';

const SYNC_FROM = 'SYNC_FROM';


/**
 * action creator
 * sets the events and deadlines lists in the redux store
 * @param {Event[]} events the new events list
 * @param {Deadline[]} deadlines the new deadlines list
 */
function syncFrom(events, deadlines) {
    return {
        type: SYNC_FROM,
        payload: {
            events,
            deadlines,
        },
    };
}

/**
 * asynchronous action creator
 * returns a function that handles getting the syncing from the server
 */
function syncFromAsync() {
    return (dispatch) => {
        request
            .post('http://127.0.0.1:8000/proto/get') // TODO: remove hardcoded URL
            .set('X-CSRFToken', unescape(Cookie.get('csrftoken'))) // for security
            .set('Content-Type', 'application/json') // expect to receive JSON
            .then((res) => {
                // create the JSON object from the string received
                const parsed = JSON.parse(res.text);

                // deserialize the deadlines
                const newDeadlines = {};
                Object.keys(parsed.deadlines).forEach((key) => {
                    // get the deadline from the response
                    newDeadlines[key] = deserializeDeadline(parsed.deadlines[key]);

                    // set the id of the current deadline
                    newDeadlines[key].id = key;
                });

                // deserialize the events
                const newEvents = {};
                Object.keys(parsed.events).forEach((key) => {
                    // get the event from the response
                    newEvents[key] = deserialize(parsed.events[key]);

                    // set the id of the current event
                    newEvents[key].id = key;


                    // need to check if the current event has a parent
                    if (newEvents[key].parent !== -1) {
                        // get the pointer to the parent deadline class
                        newEvents[key].parent = newDeadlines[newEvents[key].parent];

                        // set the child event in the parent to the current event
                        // after all iterations, the child events in the deadline class will
                        // be set up correctly with circular references
                        newEvents[key].parent.setEvent(key, newEvents[key]);
                    // set parent to null if there is none - the -1 is only for serialization
                    } else {
                        newEvents[key].parent = null;
                    }
                });

                // add the new events and deadlines from the server to the redux store
                dispatch(syncFrom(newEvents, newDeadlines));
            });
    };
}

export { syncFrom, syncFromAsync };
export { SYNC_FROM };
