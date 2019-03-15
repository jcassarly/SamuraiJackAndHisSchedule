import { Event } from '../events/Event';

const initialState = [new Event('test', 'test event', new Date('March 14, 2019 3:10:00'), new Date('March 14, 2019 4:20:00'))];

const reducer = (state = initialState) => state;

export default reducer;
