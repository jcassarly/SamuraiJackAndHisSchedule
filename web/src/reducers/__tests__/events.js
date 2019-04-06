import reducer from './events';

const state = { maxId: 0, events: {} };

test('keeps state', () => {
    expect(reducer(state)).toEqual(state);
});
