import React from 'react'
import { shallow } from 'enzyme'
import renderer from 'react-test-renderer'
import Statistic from './Statistic'

describe('<Statistic />', () => {
  it('renders without crashing', () => {
    shallow(<Statistic />)
  })

  it('should match the default snapshot', () => {
    const tree = renderer.create(<Statistic />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  describe('with no change in value over the change period', () => {
    const statWithNoChange = {
      heading: 'A statistic with no change over the change period',
      value: 1,
      change: {
        value: 0,
        period: 'week',
      },
    }

    it('should match the no change snapshot', () => {
      const tree = renderer.create(<Statistic {...statWithNoChange} />).toJSON()
      expect(tree).toMatchSnapshot()
    })
  })

  describe('with positive change value', () => {
    const statWithPositiveChange = {
      heading: 'A statistic with a positive change',
      value: 2,
      change: {
        value: 1,
        period: 'week',
      },
    }

    it('should match the positive change snapshot', () => {
      const tree = renderer.create(<Statistic {...statWithPositiveChange} />).toJSON()
      expect(tree).toMatchSnapshot()
    })
  })

  describe('with negative change value', () => {
    const statWithNegativeChange = {
      heading: 'A statistic with a negative change',
      value: 0,
      change: {
        value: -1,
        period: 'week',
      },
    }

    it('should match the negative change snapshot', () => {
      const tree = renderer.create(<Statistic {...statWithNegativeChange} />).toJSON()
      expect(tree).toMatchSnapshot()
    })
  })
})
