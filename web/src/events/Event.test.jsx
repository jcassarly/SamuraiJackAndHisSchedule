/* disable-eslint */

import Event from './Event';
import Frequency from './Frequency';
import Notifications from './Notifications';

test('name works', () => {
    const event = new Event('test');
    expect(event.name).toBe('test');
});

test('description works', () => {
    const event = new Event('test');
    expect(event.name).toBe('test');
});
