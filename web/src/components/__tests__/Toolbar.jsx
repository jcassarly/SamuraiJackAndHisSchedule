import React from 'react';
import { shallow } from 'enzyme';
import Toolbar from '../Toolbar';

const navNewEvent = jest.fn(() => {});
test('toolbar works', () => {
    const toolbar = shallow(<Toolbar navNewEvent={navNewEvent} />);
    toolbar.find('.toolbar > button').at(0).simulate('click');
    expect(navNewEvent.mock.calls).toHaveLength(1);
});
