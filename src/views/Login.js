import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Button, Card, CardBody, CardGroup, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';

export class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: ''
    };
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.onLogin = this.onLogin.bind(this);
  }

  onChangeEmail(e) {
      this.setState({
          email: e.target.value
      });
  }

  onChangePassword(e) {
      this.setState({
          password: e.target.value
      });
  }

  onLogin(e){
    e.preventDefault();
    console.log(`Form submitted:`);
    console.log(`Email: ${this.state.email}`);
    console.log(`Password: ${this.state.password}`);

    var user = {
      email: this.state.email,
      password: this.state.password
    };

    fetch("http://localhost:4000/auth/login/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(user)
    })
      .then(response => {
        if (response.ok) {
          response.json().then(json => {
            this.props.currentSession(json.sessionId);
          });
        } else {
          alert("Invalid Login Details");
          console.log("Invalid Login Details");
        }
      })
      .catch(res => {
        console.log(res);
      });

    this.setState({
        email: '',
        password: '',
    })

  };

  render() {
    return (
<div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="8">
              <CardGroup>
                <Card className="p-4">
                  <CardBody>
                    <Form>
                      <h1>Adnat</h1>
                      <h2>Login</h2>
                      <p className="text-muted">Sign In to your account</p>
                      <InputGroup className="mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-user"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input type="text" 
                          value={this.state.email}
                          onChange={this.onChangeEmail}
                          placeholder="Email Address" autoComplete="email" />
                      </InputGroup>
                      <InputGroup className="mb-4">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-lock"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input type="password" 
                          value={this.state.password}
                          onChange={this.onChangePassword}
                        placeholder="Password" autoComplete="current-password" />
                      </InputGroup>
                      <Row>
                        <Col xs="6">
                          <Button color="primary" onClick={this.onLogin} className="px-4">Login</Button>
                        </Col>
                        <Col xs="6" className="text-right">
                          <Button color="link" className="px-0">Forgot password?</Button>
                        </Col>
                      </Row>
                    </Form>
                  </CardBody>
                </Card>
                <Card className="text-white bg-primary py-5 d-md-down-none" style={{ width: '44%' }}>
                  <CardBody className="text-center">
                    <div>
                      <h2>Sign up</h2>
                      <Link to="/register">
                        <Button color="primary" onClick={this.props.onSignUp} className="mt-3" active tabIndex={-1}>Register Now!</Button>
                      </Link>
                    </div>
                  </CardBody>
                </Card>
              </CardGroup>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Login;
