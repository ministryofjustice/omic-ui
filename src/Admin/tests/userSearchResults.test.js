import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { UserSearchResults } from "../MaintainRoles/components/UserSearchResults";

Enzyme.configure({ adapter: new Adapter() });

const user = {
  activeCaseLoadId: "LEI",
  caseLoadOptions: [{ caseLoadId: "LEI", description: "LEEDS (HMP)", type: "INST", caseloadFunction: "GENERAL" }]
};
const NAME_COLUMN = 0;
const USERNAME_COLUMN = 1;

describe('User search Results component', () => {
  it('should render the initial view of User search', async () => {
    const component = shallow(<UserSearchResults user={user}
      nameFilter={''}
      roleFilter={''}
      roleList={[{ roleCode: 'ROLE_1', roleName: 'Role 1' }, { roleCode: 'ROLE_2', roleName: 'Role 2' }]}
      userList={[{
        staffId: 70029,
        username: "HQA63K",
        firstName: "MARTHA",
        lastName: "HUNSTON"
      },
      {
        staffId: 485573,
        username: "AKNIGHT_GEN",
        firstName: "ANDREW",
        lastName: "KNIGHT"
      }
      ]}
      agencyId={'LEI'}
      nameFilterDispatch={jest.fn()}
      displayBack={jest.fn()}
      handleAllowAutoChange={jest.fn()}
      roleFilterDispatch={jest.fn()}
      roleListDispatch={jest.fn()}
      handleRoleFilterChange={jest.fn()}
      handleNameFilterChange={jest.fn()}
      handleEdit={jest.fn()}
      handleSearch={jest.fn()}/>);
    console.log(component.debug());
    const searchComponent = component.find('UserSearch').shallow();
    expect(searchComponent.find('#search-button').text()).toEqual("Search");
    expect(component.find('tr').at(1).find('td').at(NAME_COLUMN).text()).toEqual('Hunston, Martha');
    expect(component.find('tr').at(1).find('td').at(USERNAME_COLUMN).text()).toEqual('HQA63K');
  });

  it('should handle updates', async () => {
    const handleSubmitMock = jest.fn();
    const handleEditMock = jest.fn();
    const handleNameFilterMock = jest.fn();
    const handleRoleSelectMock = jest.fn();
    const component = shallow(<UserSearchResults user={user}
      nameFilter={''}
      roleFilter={''}
      userList={[{
        staffId: 70029,
        username: "HQA63K",
        firstName: "MARTHA",
        lastName: "HUNSTON"
      },
      {
        staffId: 485573,
        username: "AKNIGHT_GEN",
        firstName: "ANDREW",
        lastName: "KNIGHT"
      }
      ]}
      agencyId={'LEI'}
      nameFilterDispatch={jest.fn()}
      displayBack={jest.fn()}
      handleAllowAutoChange={jest.fn()}
      roleFilterDispatch={jest.fn()}
      roleListDispatch={jest.fn()}
      handleRoleFilterChange={handleRoleSelectMock}
      handleNameFilterChange={handleNameFilterMock}
      handleEdit={handleEditMock}
      handleSearch={handleSubmitMock}/>);
    const searchComponent = component.find('UserSearch').shallow();
    searchComponent.find('button').simulate('click');
    expect(handleSubmitMock).toHaveBeenCalled();
    searchComponent.find('#name-filter').simulate('change', { target: { value: 'Hello' } });
    expect(handleNameFilterMock).toHaveBeenCalled();
    searchComponent.find('#role-select').simulate('change', { target: { value: 'ROLE_2' } });
    expect(handleRoleSelectMock).toHaveBeenCalled();
  });
});


