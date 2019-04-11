import React from 'react'
import renderer from 'react-test-renderer'
import Table from '@govuk-react/table'
import AuthUser from './AuthUser'

const user = {
  username: 'joesmith',
  firstName: 'Joe',
  lastName: 'Smith',
  locked: false,
  enabled: true,
  email: 'joe.smith@justice.gov.uk',
}

describe('Auth search results form', () => {
  const stubFunc = () => {}

  describe('no roles', () => {
    const wrapper = renderer.create(
      <AuthUser contextUser={user} roleList={[]} handleAdd={stubFunc} handleRemove={stubFunc} />
    )
    it('should render correctly with user and no roles', () => {
      expect(wrapper.toJSON()).toMatchSnapshot()
    })

    it('should display message about no roles found', () => {
      const tableRows = wrapper.root.findAllByType(Table.Row)
      // last table row should have message
      expect(tableRows[tableRows.length - 1].props.children[0].props.children).toEqual('No roles found')
    })
  })

  it('should render correctly with user and roles', () => {
    const wrapper = renderer.create(
      <AuthUser
        contextUser={user}
        roleList={[{ roleCode: 'roleA', roleName: 'Role A' }, { roleCode: 'roleB', roleName: 'Role B' }]}
        handleAdd={stubFunc}
        handleRemove={stubFunc}
      />
    )

    expect(wrapper.toJSON()).toMatchSnapshot()
  })
})
