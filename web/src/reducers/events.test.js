import reducer from './events';

let state = { maxId: 0, events: {} };

test('keeps state', () => {
    expect(reducer(state)).toEqual(state);
});