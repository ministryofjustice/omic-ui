import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { toFullName } from '../stringUtils';

import './theme.scss';

class Dropdown extends Component {
  constructor (props) {
    super(props);
    this.state = {
      isOpen: false
    };

    this.closeMenu = this.closeMenu.bind(this);
    this.toggleMenu = this.toggleMenu.bind(this);
  }

  closeMenu () {
    this.setState({ isOpen: false });
  }
  toggleMenu () {
    this.setState({ isOpen: !this.state.isOpen });
  }
  render () {
    const { user, switchCaseLoad, history } = this.props;
    const caseLoadDesc = user.activeCaseLoad && user.activeCaseLoad.description ? user.activeCaseLoad.description : user.activeCaseLoadId;

    /*innerRef={(wrapper) => { this.wrapper = wrapper; }} onMouseDown={this.handleMouseDown} onTouchStart={this.handleMouseDown}*/

    return (
      <div className="menu-wrapper" >
        <div className="info-wrapper clickable" onClick={() => this.toggleMenu()}>
          <strong className="user-name">{toFullName(user)}
            {/*<div className="notification-number notification-number-user">{user.totalAssignments}</div>*/}
          </strong>
          <span className="case-load">{caseLoadDesc}</span>
        </div>
        <div className="dropdown-menu">
          { this.state.isOpen &&
          <div>
            {user.caseLoadOptions.map((option) =>
              (<a className="dropdown-menu-option" key={option.caseLoadId} onClick={() => {
                this.closeMenu();
                switchCaseLoad(option.caseLoadId);
                history.push("/unallocated");
              }}>
                {option.description}
              </a>))
            }
            <a className="dropdown-menu-link" key={'logout'} onClick={() => this.closeMenu()} to={'/logout'}>
              Log out
            </a>
          </div> }
        </div>
      </div>
    );
  }
}

Dropdown.propTypes = {
  user: PropTypes.object,
  switchCaseLoad: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired
};

Dropdown.defaultProps = {
  user: {
    firstName: 'first',
    activeCaseLoadId: 'id'
  }
};

export default Dropdown;