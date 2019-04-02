import React, { Component } from "react";

import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";

import LoginPage from "./views/Login";
import SignUpPage from "./views/SignUp";
import Header from "./components/Header";
import Organisations from "./views/Organisations";
import Shifts from "./views/Shifts";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userAttributes: {
        organisationId: ""
      },
      sessionId: undefined,
      organisations: [],
      showSignUpComponent: false,
      shifts: undefined,
      showShifts: undefined
    };
  }

  logout = () => {
    this.setState({ sessionId: undefined, showShifts: false });
  };

  fetchUserAttributes = sessionId => {
    return fetch("http://localhost:4000/users/me/", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: sessionId
      }
    });
  };

  currentSession = sessionId => {
    let userAttributes = this.fetchUserAttributes(sessionId)
      .then(response => response.json())
      .then(json =>
        this.setState({
          userAttributes: json,
          sessionId: sessionId
        })
      );

    let organisations = this.getOrganisations(sessionId)
      .then(response => response.json())
      .then(json =>
        this.setState({
          organisations: json
        })
      );
    Promise.all([userAttributes, organisations]).then(() => {
      if (this.state.userAttributes.organisationId !== null) {
        let shifts = this.getShifts(sessionId)
          .then(response => response.json())
          .then(json =>
            this.setState({
              shifts: json
            })
          );
        Promise.all([shifts]).then(() => {
          this.setState({
            sessionId: sessionId
          });
        });
      }
    });
  };

  retrieveData = () => {
    let organisations = this.getOrganisations(this.state.sessionId)
      .then(response => response.json())
      .then(json =>
        this.setState({
          organisations: json
        })
      );
      
    let userAttributes = this.fetchUserAttributes(this.state.sessionId)
      .then(response => response.json())
      .then(json =>
        this.setState({
          userAttributes: json
        })
      );

    Promise.all([userAttributes, organisations]).then(() => {
      if (this.state.userAttributes.organisationId !== null) {
        let shifts = this.getShifts(this.state.sessionId)
          .then(response => response.json())
          .then(json =>
            this.setState({
              shifts: json
            })
          );
        Promise.all([shifts]).then(() => {
          this.forceUpdate();
        });
      }
    });
  };

  getOrganisations = sessionId => {
    return fetch("http://localhost:4000/organisations", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: sessionId
      }
    });
  };

  getShifts = sessionId => {
    return fetch("http://localhost:4000/shifts", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: sessionId
      }
    });
  };

  onSignUp = () => {
    this.setState(prevState => ({
      showSignUpComponent: !prevState.showSignUpComponent
    }));
  };

  toggleShift = () => {
    this.setState(prevState => ({
      showShifts: !prevState.showShifts
    }));
  };

  render() {
    if (this.state.sessionId === undefined) {
      return (

        <Router>
          <div>
            <Header logout={this.logout} sessionId={this.state.sessionId} />
            {this.state.showSignUpComponent ? (
              <Switch>
                <Route path="/signup" render={props => (
                    <SignUpPage {...props} sessionId={this.state.sessionId} currentSession={this.currentSession} onSignUp={this.onSignUp} />
                  )}
                />
                <Redirect to="/signup" />
              </Switch>
            ) : (
              <Switch>
                <Route
                  path="/login"
                  render={props => (
                    <LoginPage
                      {...props}
                      sessionId={this.state.sessionId}
                      currentSession={this.currentSession}
                      onSignUp={this.onSignUp}
                    />
                  )}
                />
                <Redirect to="/login" />
              </Switch>
            )}
          </div>
        </Router>
      );
    }
    else
    {

    return (
      <Router>
        <div>
          <Header
            sessionId={this.state.sessionId}
            logout={this.logout}
            userAttributes={this.state.userAttributes}
          />
          <div className="container">
            {this.state.showShifts ? (
              <Switch>
                <Route
                  path="/shifts"
                  render={props => (
                    <Shifts
                      {...props}
                      sessionId={this.state.sessionId}
                      userAttributes={this.state.userAttributes}
                      organisations={this.state.organisations}
                      shifts={this.state.shifts}
                      getData={this.retrieveData}
                      toggleShift={this.toggleShift}
                    />
                  )}
                />
                <Redirect to="/shifts" />
              </Switch>
            ) : (
              <Switch>
                <Route
                  path="/organisations"
                  render={props => (
                    <Organisations
                      {...props}
                      sessionId={this.state.sessionId}
                      userAttributes={this.state.userAttributes}
                      organisations={this.state.organisations}
                      getData={this.retrieveData}
                      getOrganisations={this.getOrganisations}
                      toggleShift={this.toggleShift}
                    />
                  )}
                />
                <Redirect to="/organisations" />
              </Switch>
            )}
          </div>
        </div>
      </Router>
    );
      
    }
  }
}

export default App;
