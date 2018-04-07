import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { moment } from 'moment'

import { ErrorMessage, Loader, DayForecast } from './Home';

Enzyme.configure({ adapter: new Adapter() })

describe('ErrorMessage', () => {
    const wrapper = shallow(<ErrorMessage><div className="unique"/></ErrorMessage>);

    it('renders without exploding', () => {
        expect(wrapper).toHaveLength(1);
    });

    it('renders children', () => {
        expect(wrapper.contains(<div className="unique"/>)).toEqual(true);
    });
});

describe('Loader', () => {
    const wrapper = shallow(<Loader><div className="unique"/></Loader>);
    
    it('renders without exploding', () => {
        expect(wrapper).toHaveLength(1);
    });

    it('do not render children', () => {
        expect(wrapper.contains(<div className="unique"/>)).toEqual(false);
    });
});

describe('DayForecast', () => {
    const testProps = {
        wind: {
            deg: 15,
            speed: 20
        },
        dt: 0,
        weather: [{
            icon: "icon",
            description: "description",
        }],
        main: {
            temp: 273.15,
            pressure: 1200,
            humidity: 25
        }
    };
    const wrapper = shallow(<DayForecast forecast={testProps}><div className="unique"/></DayForecast>);
    
    it('renders without exploding', () => {
        expect(wrapper).toHaveLength(1);
    });

    it('do not render children', () => {
        expect(wrapper.contains(<div className="unique"/>)).toEqual(false);
    });

    it('show correct day name', () => {
        expect(wrapper.find(".weekDay").text()).toEqual('Thursday');
    });
});