import moment from 'moment-timezone';
import Day from '../Day';

jest.mock('../../../em2px');

const nonDaylight = moment.tz('2019-03-19T08:00:00Z', 'America/New_York');

test('generateHours func', () => {
    const genedHours = Day.generateHours(nonDaylight);
    for (let i = 0; i < 24; i += 1) {
        expect(genedHours[i].hour).toBe(i);
    }
});
