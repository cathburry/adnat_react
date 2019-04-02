
import React, { Component } from "react";
import { Button, Card, CardBody, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';

export class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      password: "",
      passwordConfirmation: ""
    };
    this.signup = this.signup.bind(this);
    this.onChangeName = this.onChangeName.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.onChangePasswordConfirmation = this.onChangePasswordConfirmation.bind(this);
  }

  signup(e) {
    e.preventDefault();
    var user = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      passwordConfirmation: this.state.passwordConfirmation
    };
    console.log(`Form submitted:`);
    console.log(`Name: ${this.state.name}`);
    console.log(`Email: ${this.state.email}`);
    console.log(`Password: ${this.state.password}`);
    console.log(`Confirm password: ${this.state.password}`);

    fetch("http://localhost:4000/auth/signup/", {
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
          console.log("test");
        } else {
          console.log("Sign Up Failed");
        }
      })
      .catch(res => {
        console.log(res);
      });
  };

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

  onChangeName(e) {
      this.setState({
          name: e.target.value
      });
  }

  onChangePasswordConfirmation(e) {
      this.setState({
          passwordConfirmation: e.target.value
      });
  }

  render() {
    return (
<div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="9" lg="7" xl="6">
              <Card className="mx-4">
                <CardBody className="p-4">
                  <Form onSubmit={this.signup}>
                    <h1>Sign Up</h1>
                    <p className="text-muted">Create your account</p>
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-user"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type="text" 
                        placeholder="Name" 
                        autoComplete="name" 
                        value={this.state.name}
                        onChange={this.onChangeName}
                      />
                    </InputGroup>
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>@</InputGroupText>
                      </InputGroupAddon>
                      <Input type="text" 
                        placeholder="Email" 
                        value={this.state.email}
                        onChange={this.onChangeEmail}
                        autoComplete="email" 
                      />
                    </InputGroup>
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-lock"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type="password" 
                        placeholder="Password" 
                        autoComplete="new-password" 
                        value={this.state.password}
                        onChange={this.onChangePassword}
                      />
                    </InputGroup>
                    <InputGroup className="mb-4">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-lock"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type="password" 
                        placeholder="Confirm password" 
                        autoComplete="new-password" 
                        value={this.state.passwordConfirmation}
                        onChange={this.onChangePasswordConfirmation}
                      />
                    </InputGroup>
                    <Button color="success" type="success" block>Create Account</Button>
                    <Button color="primary" onClick={this.props.onSignUp} className="mt-3" active tabIndex={-1} block>Go Back</Button>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Signup;
