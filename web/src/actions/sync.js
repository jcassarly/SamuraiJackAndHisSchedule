import Cookie from 'js-cookie';
import request from 'superagent';
import { deserialize } from '../events/Event';
import { deserializeDeadline } from '../events/Deadline';

const SYNC_FROM = 'SYNC_FROM';


function syncFrom(events, deadlines) {
    return {
        type: SYNC_FROM,
        payload: {
            events,
            deadlines,
        },
    };
}

function syncFromAsync() {
    return (dispatch) => {
        console.log('yeeeeeeeeeeet');
        request
            .post('http://127.0.0.1:8000/proto/get')
            .set('X-CSRFToken', unescape(Cookie.get('csrftoken')))
            .set('Content-Type', 'application/json')
            .then((res) => {
                console.log(res.text);
                const parsed = JSON.parse(res.text);
                console.log(parsed);


                const newDeadlines = {};
                Object.keys(parsed.deadlines).forEach((key) => {
                    newDeadlines[key] = deserializeDeadline(parsed.deadlines[key]);
                    newDeadlines[key].id = key;
                });

                const newEvents = {};
                Object.keys(parsed.events).forEach((key) => {
                    newEvents[key] = deserialize(parsed.events[key]);
                    newEvents[key].id = key;

                    // get the pointer to the parent deadline class
                    if (newEvents[key].parent !== -1) {
                        newEvents[key].parent = newDeadlines[newEvents[key].parent];
                        newEvents[key].parent.setEvent(key, newEvents[key]);
                    } else {
                        newEvents[key].parent = null;
                    }
                });

                console.log(newEvents);
                console.log(newDeadlines);
                // eslint-disable-next-line
                dispatch(syncFrom(newEvents, newDeadlines));
            });
    };
}

export { syncFrom, syncFromAsync };
export { SYNC_FROM };
