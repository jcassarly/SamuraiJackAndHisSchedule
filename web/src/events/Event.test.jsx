import { Event } from './Event';

test('name works', () => {
    const event = new Event('test');
    expect(event.name).toBe('test');
});
