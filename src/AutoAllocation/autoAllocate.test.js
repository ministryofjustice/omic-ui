import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { AutoAllocate } from "./container";
import axiosWrapper from '../backendWrapper';
const AXIOS_URL = 0;
const AXIOS_CONFIG = 1;

Enzyme.configure({ adapter: new Adapter() });

describe('AutoAllocate component', () => {
  it('should get page 1 correctly', async () => {
    const mockAxios = jest.fn();
    axiosWrapper.get = mockAxios;
    mockAxios.mockReturnValueOnce([200, ["s1", "s2"], {}]);

    await shallow(<AutoAllocate page={1} jwt={"dummy-jwt"} agencyId={'LEI'} onFinishAllocation={jest.fn()} setErrorDispatch={jest.fn()} setMessageDispatch={jest.fn()} unallocatedListDispatch={jest.fn()}
      manualOverrideDispatch={jest.fn()} manualOverrideDateFilterDispatch={jest.fn()} setCurrentPageDispatch={jest.fn()} allocatedDetailsDispatch={jest.fn()}/>);

    expect(mockAxios.mock.calls.length).toBe(1);
    expect(mockAxios.mock.calls[0][0]).toBe('/unallocated');
    expect(mockAxios.mock.calls[0][1].headers.jwt).toBe('dummy-jwt');
  });

  it('should go to page 2 correctly', async () => {
    const mockAxios = jest.fn();
    axiosWrapper.get = mockAxios;
    // /unallocated
    mockAxios.mockReturnValueOnce([200, ["s1", "s2"], {}]);
    // /allocated
    mockAxios.mockReturnValueOnce([200, ["s3", "s4"], {}]);

    const component = await shallow(<AutoAllocate page={1} jwt={"dummy-jwt"} agencyId={'LEI'} onFinishAllocation={jest.fn()} setErrorDispatch={jest.fn()} setMessageDispatch={jest.fn()} unallocatedListDispatch={jest.fn()}
      manualOverrideDispatch={jest.fn()} manualOverrideDateFilterDispatch={jest.fn()} setCurrentPageDispatch={jest.fn()} allocatedDetailsDispatch={jest.fn()}/>);

    // Simulate clicking to 2nd page
    component.instance().gotoManualAllocation();

    expect(mockAxios.mock.calls.length).toBe(2);
    expect(mockAxios.mock.calls[0][AXIOS_URL]).toBe('/unallocated');
    expect(mockAxios.mock.calls[0][AXIOS_CONFIG].headers.jwt).toBe('dummy-jwt');
    expect(mockAxios.mock.calls[1][AXIOS_URL]).toBe('/allocated');
    expect(mockAxios.mock.calls[1][AXIOS_CONFIG].headers.jwt).toBe('dummy-jwt');
    expect(mockAxios.mock.calls[1][AXIOS_CONFIG].params.agencyId).toBe('LEI');
  });

  // page 3 TODO

  it('should render a middle tier error on page 1 correctly', (done) => {
    const mockAxios = jest.fn(); // v22+ .mockName('mockAxios');
    axiosWrapper.get = mockAxios;
    // /unallocated
    mockAxios.mockImplementationOnce(() => Promise.reject(new Error("Request failed with status code 500,test error")));


    const component = shallow(<AutoAllocate page={1} jwt={"dummy-jwt"} agencyId={'LEI'} onFinishAllocation={jest.fn()} setErrorDispatch={jest.fn()} setMessageDispatch={jest.fn()} unallocatedListDispatch={jest.fn()}
      manualOverrideDispatch={jest.fn()} manualOverrideDateFilterDispatch={jest.fn()} setCurrentPageDispatch={jest.fn()} allocatedDetailsDispatch={jest.fn()} error="Something went wrong: Error: Request failed with status code 500,test error"/>);


    setTimeout(() => {
      component.update();
      expect(mockAxios.mock.calls.length).toBe(1);
      expect(mockAxios.mock.calls[0][AXIOS_URL]).toBe('/unallocated');
      //const usefulDump = component.debug();
      expect(component.contains("Something went wrong: Error: Request failed with status code 500,test error")).toBe(true);
      done();
    }, 5);
  });

  it('should render a middle tier error on page 2 correctly', (done) => {
    const mockAxios = jest.fn();
    axiosWrapper.get = mockAxios;
    // /unallocated
    mockAxios.mockReturnValueOnce([200, ["s1", "s2"], {}]);
    // /allocated
    mockAxios.mockImplementationOnce(() => Promise.reject(new Error("Request failed with status code 500,test error")));

    const component = shallow(<AutoAllocate page={1} jwt={"dummy-jwt"} agencyId={'LEI'} onFinishAllocation={jest.fn()} setErrorDispatch={jest.fn()} setMessageDispatch={jest.fn()} unallocatedListDispatch={jest.fn()}
      manualOverrideDispatch={jest.fn()} manualOverrideDateFilterDispatch={jest.fn()} setCurrentPageDispatch={jest.fn()} allocatedDetailsDispatch={jest.fn()} error="Something went wrong: Error: Request failed with status code 500,test error"/>);

    // Simulate clicking to 2nd page
    component.instance().gotoManualAllocation();

    console.log(component.debug());

    setTimeout(() => {
      component.update();
      expect(mockAxios.mock.calls.length).toBe(2);
      expect(mockAxios.mock.calls[0][AXIOS_URL]).toBe('/unallocated');
      expect(mockAxios.mock.calls[1][AXIOS_URL]).toBe('/allocated');
      expect(component.contains("Something went wrong: Error: Request failed with status code 500,test error")).toBe(true);
      done();
    }, 5);
  });

  // TODO page 3
});