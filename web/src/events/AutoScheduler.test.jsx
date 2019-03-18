import { Event } from './Event';
import {autoSchedule} from './AutoScheduler.jsx';

test('name works', () => {
    const event = new Event('test');
    expect(event.name).toBe('test');
});