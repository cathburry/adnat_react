import React, { Component } from 'react';
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  Col,
  Form,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  Row,
} from 'reactstrap';

export class Organisations extends Component {
  constructor(props) {
    super(props);
    this.state = {
      idEdit: "",
      name: "",
      hourlyRate: "",
      nameEdit: "",
      hourlyRateEdit: "",
      editing: false,
      viewShifts: false,
      organisationName: '',
      modal: false,
      currentOrg: false,
    };
    this.toggleModal = this.toggleModal.bind(this);
    this.onChangeName = this.onChangeName.bind(this);
    this.onChangeHourlyRate = this.onChangeHourlyRate.bind(this);
    this.onChangeNameEdit = this.onChangeNameEdit.bind(this);
    this.onChangeHourlyRateEdit = this.onChangeHourlyRateEdit.bind(this);
    this.joinOrganisation = this.joinOrganisation.bind(this);
    this.toggleEditAnyOrganisation = this.toggleEditAnyOrganisation.bind(this);
    this.toggleCurrentOrganisation = this.toggleCurrentOrganisation.bind(this);
  }


  joinOrganisation = (organisationId, organisationName) => {
    var data = {
      organisationId: organisationId
    };
    fetch("http://localhost:4000/organisations/join", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: this.props.sessionId
      },
      body: JSON.stringify(data)
    }).then(res => {
      this.props.getData(this.props.sessionId);
    });
    this.setState({ organisationName: organisationName });
  };
  
  createOrganisation = e => {
    e.preventDefault();
    var data = {
      name: this.state.name,
      hourlyRate: this.state.hourlyRate
    };

    fetch("http://localhost:4000/organisations/create_join", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: this.props.sessionId
      },
      body: JSON.stringify(data)
    })
      .then(res => {
        this.setState({modal: false})
        this.props.getData(this.props.sessionId);
      })
      .catch(res => {
        console.log(res);
      });
  };

  toggleEditAnyOrganisation = (organisationId, organisationName, hourlyRate) => {
    this.setState({editing: true});
    
    this.setState({
      idEdit: organisationId,
      nameEdit: this.state.currentOrg !== true ? organisationName: "",
      hourlyRateEdit: this.state.currentOrg !== true ? hourlyRate : ""
    });
  };

  toggleCurrentOrganisation = () => {
    this.setState({editing: true, currentOrg: true});
    
    this.setState({
      idEdit: this.props.userAttributes.organisationId,
      nameEdit: "",
      hourlyRateEdit: ""
    });
  };

  editAnyOrganisation(e) {
    var data = {
      hourlyRate: this.state.hourlyRateEdit,
      name: this.state.nameEdit
    };
    fetch("http://localhost:4000/organisations/" + this.state.idEdit, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: this.props.sessionId
      },
        body: JSON.stringify(data)
      }
    )
      .then(res => {
        this.props.getData(this.props.sessionId);
      })
      .catch(res => {
        console.log(res);
      });
    // update dom
    this.setState({
      organisationName: data.name,
      hourlyRateEdit: "",
      nameEdit: "",
      editing: false,
      currentOrg: false
    });
  };

  leaveOrg = () => {
    this.setState({currentOrg: false});
    fetch("http://localhost:4000/organisations/leave", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: this.props.sessionId
      }
    }).then(res => {
      this.props.getData(this.props.sessionId);
    });
    this.setState({ editing: false });
  };

  editOrganisation = e => {
    e.preventDefault();

    var data = {
      name: this.state.nameEdit,
      hourlyRate: this.state.hourlyRateEdit
    };

    fetch(
      "http://localhost:4000/organisations/" +
        this.state.idEdit.toString(),
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: this.props.sessionId
        },
        body: JSON.stringify(data)
      }
    )
      .then(res => {
        this.setState({currentOrg: false});
        this.props.getData(this.props.sessionId);
      })
      .catch(res => {
        console.log(res);
      });
    // update dom
    this.setState({
      organisationName: data.name,
      editing: false
    });
  };

  onChangeName(e) {
      this.setState({
          name: e.target.value
      });
  }

  onChangeHourlyRate(e) {
      this.setState({
          hourlyRate: e.target.value
      });
  }

  onChangeNameEdit(e) {
      this.setState({
          nameEdit: e.target.value
      });
  }

  onChangeHourlyRateEdit(e) {
      this.setState({
          hourlyRateEdit: e.target.value
      });
  }

  toggleModal() {
    this.setState({
      modal: !this.state.modal,
    });
  }

  todoList() {
      return this.props.organisations.map(function(currentOrg, i){
          return (
          <tr>
              <td>{currentOrg.id}</td>
              <td>{currentOrg.name}</td>
              <td>
                  <Button color="link" xl onClick={() => this.toggleEditAnyOrganisation(currentOrg.id, currentOrg.name, currentOrg.hourlyRate)}>Edit</Button>&nbsp;|&nbsp;
                  <Button color="link" xl onClick={() => this.joinOrganisation(currentOrg.id, currentOrg.name)}>Join</Button>
              </td>
          </tr>
          );
      }, this)
  }

  render() {
    if (this.props.userAttributes.organisationId === null && this.state.editing === false) {
        return (
        <div className="animated fadeIn">
          <Row>
            <Col xs="12" sm="12" lg="12"  className="padding-top-org">
              <h2><b>ADNAT</b></h2>
              <h4>Logged in as {this.props.userAttributes.name.toString()}!</h4>
              <p>You aren't a member of any organizations. Join an exisiting one or create a new one.</p>
            </Col>
            <Col sm="12">
              <Col col="2" className="mb-3 mb-xl-0 text-right">
                <Button color="primary" onClick={this.toggleModal} size="md">Add New Organization</Button>
              </Col>
              <Modal isOpen={this.state.modal} toggle={this.toggleModal}
                     className='modal-md'>
                <Form>
                <ModalHeader toggle={this.toggleModal}>New Organization</ModalHeader>
                <ModalBody>
                    <FormGroup>
                        <Input type="text" id="name" 
                          value={this.state.name}
                          onChange={this.onChangeName}
                          placeholder="Organization Name" required />
                      </FormGroup>
                    <FormGroup row>
                      <Col md="12">
                        <InputGroup>
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="fa fa-dollar"></i>
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input type="number" id="input3-group1" 
                            value={this.state.hourlyRate}
                            onChange={this.onChangeHourlyRate}
                            name="input3-group1" placeholder="Hourly Rate" />
                        </InputGroup>
                      </Col>
                    </FormGroup>
                </ModalBody>
                <ModalFooter>
                  <Button color="primary" onClick={this.createOrganisation} >Create and Join</Button>
                  <Button color="secondary" onClick={this.toggleModal}>Cancel</Button>
                </ModalFooter>
                </Form>
              </Modal>
              <br/>    
              <Card>
                <CardBody>
                  <div>
                    <h3>Organizations List</h3>
                    <table className="table table-striped" style={{ marginTop: 20 }} >
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Organization Name</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            { this.todoList() }
                        </tbody>
                    </table>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      );
  } else if (this.state.editing) {
        return (
        <div className="animated fadeIn">
        <br />
          <div className="padding-top-org-2">
        <h2><b>ADNAT</b></h2>
        <h4>Logged in as {this.props.userAttributes.name.toString()}</h4><br/>
            <Card>
              <CardHeader>
                <strong>Edit {this.state.nameEdit}</strong>
              </CardHeader>
            <CardBody>
            <form
              onSubmit={this.editOrganisation}
            >
              <br />
              <FormGroup>
                <Label htmlFor="name">Name</Label>
                <Input type="text" id="name" 
                name="name"
                value={this.state.nameEdit}
                onChange={this.onChangeNameEdit}
                placeholder="Enter new organizaton name" required />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="name">Hourly Rate: $</Label>
                <Input type="text" id="name" 
                name="name"
                value={this.state.hourlyRateEdit}
                onChange={this.onChangeHourlyRateEdit}
                placeholder="Enter hourly rate" required />
              </FormGroup>
              <center>
              <Button color="default"
                  onClick={() => this.setState({ editing: false })}
                  type="button"
                >
                  Cancel
                </Button>&nbsp;&nbsp;&nbsp;
                <Button color="primary" type="submit">Update</Button><br/><br/><br/>
                {this.state.currentOrg ? 
                <Button color="danger"  className="leave-button-width" onClick={this.leaveOrg} type="button">
                  Leave
                </Button>
                  : ""}
              </center>
            </form>
            </CardBody>
            </Card>
          </div>
        </div>
        );
      } else {
        return (
          <div>
          <br/>
            <Col xs="12" sm="12" lg="12"  className="padding-top-org-2">
              <h2><b>ADNAT</b></h2>
              <h4>Logged in as {this.props.userAttributes.name.toString()}</h4>
            </Col>
            <br/><br/>
            <br />
            <Card>
            <CardHeader>
              <h4>Welcome{" "}
              { this.state.organisationName ? (
                <span>to {this.state.organisationName}</span>
              ) : (
                <span />
              )}</h4>
            </CardHeader>
            <CardBody>
            <center>
            <Row className="row-align">
            <Col xs="12" sm="6" md="4" className="col-color">
            <img src="shift.png" className="button-size-shift" alt="View Shifts" color="primary" xl block onClick={this.props.toggleShift}/>
            <h5>View Shifts</h5>
            </Col>
            <Col xs="12" sm="6" md="4" className="col-color button-shift-edit">
            <img src="edit.png" className="button-size-shift" alt="Edit Organisation" color="success" xl block onClick={this.toggleCurrentOrganisation}/>
            <h5>Edit Organisation</h5>
            </Col>
            <Col xs="12" sm="6" md="4" className="col-color button-shift-leave">
            <img src="leave.png" className="button-size-shift" alt="Leave Organisation" color="danger" xl block onClick={this.leaveOrg}/>
            <h5>Leave Organisation</h5>
            </Col>
            </Row>
            </center>
            </CardBody>
            </Card>
          </div>
        );
      }
    }
}


export default Organisations;
