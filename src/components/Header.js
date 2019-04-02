import React, { Component, Suspense } from "react";
import { DropdownItem, DropdownMenu, DropdownToggle, Nav} from 'reactstrap';
import { AppHeaderDropdown, AppHeader } from '@coreui/react';

export class Header extends Component {

  loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>

  logout = () => {
    fetch("http://localhost:4000/auth/logout", {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: this.props.sessionId
      }
    }).then(() => {
      this.props.logout();
    });
  };

  render() {
    if (this.props.sessionId) {
      return (
        <AppHeader fixed>
          <Suspense  fallback={this.loading()}>
          <Nav className="ml-auto" navbar>
            <AppHeaderDropdown direction="down">
              <DropdownToggle nav>
                <img src={'userlogo.png'} className="img-avatar" alt="logout" />
              </DropdownToggle>
              <DropdownMenu right style={{ right: 'auto' }}>
                <DropdownItem header tag="div" className="text-center"><strong>Account</strong></DropdownItem>
                <DropdownItem><i className="fa fa-user"></i> Profile</DropdownItem>
                <DropdownItem onClick={e => this.props.logout(e)}><i className="fa fa-lock"></i> Logout</DropdownItem>
              </DropdownMenu>
            </AppHeaderDropdown>
          </Nav>
          </Suspense>
        </AppHeader>
      );
    } else {
      return (
        <div className="header">
        </div>
      );
    }
  }
}

export default Header;
