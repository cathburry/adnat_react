import React, { Component } from "react";
import { Button, Card, CardBody, CardHeader, Input } from 'reactstrap';

export class Shifts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: "",
      start: "",
      finish: "",
      breakLength: "",
    };
    this.onChangeDate = this.onChangeDate.bind(this);
    this.onChangeStart = this.onChangeStart.bind(this);
    this.onChangeFinish = this.onChangeFinish.bind(this);
    this.onChangeBreakLength = this.onChangeBreakLength.bind(this);
    this.displayTableBody = this.displayTableBody.bind(this);
  }

  onChangeDate(e) {
      this.setState({
          date: e.target.value
      });
  }

  onChangeStart(e) {
      this.setState({
          start: e.target.value
      });
  }
  onChangeFinish(e) {
      this.setState({
          finish: e.target.value
      });
  }

  onChangeBreakLength(e) {
      this.setState({
          breakLength: e.target.value
      });
  }

  getHourlyRate() {
    let hourlyRate;
    for (let j = 0; j < this.props.organisations.length; j++) {
      if (this.props.userAttributes.organisationId === this.props.organisations[j].id ) {
        hourlyRate = this.props.organisations[j].hourlyRate;
      }
    }
    return hourlyRate;
  }

  displayTableBody = e => {
    let hourlyRate = this.getHourlyRate();

    return this.props.shifts.map(function(currentShift, i){

      let start = new Date(currentShift.start).getHours();
      let finish = new Date(currentShift.finish).getHours();
      let shiftLength = finish - start;
      let shiftCost = (finish - start - currentShift.breakLength / 60) * hourlyRate;

      return(
          <tr>
              <td>{currentShift.id}</td>
              <td>{currentShift.name}</td>
              <td>{currentShift.start.substr(0, 10)}</td>
              <td>{currentShift.start.substr(10, 15)}</td>
              <td>{currentShift.finish.substr(10, 15)}</td>
              <td>{currentShift.breakLength}</td>
              <td>{shiftLength}</td>
              <td>{"$" + shiftCost}</td>
          </tr>)
    })
  }

  onSubmit = e => {
    e.preventDefault();
    var data = {
      userId: this.props.userAttributes.id,
      start: this.state.date + " " + this.state.start,
      finish: this.state.date + " " + this.state.finish
    };

    if (this.state.breakLength !== "") {
      data.breakLength = this.state.breakLength;
    }

    fetch("http://localhost:4000/shifts/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: this.props.sessionId
      },
      body: JSON.stringify(data)
    })
    .then(res => {
      this.props.getData(this.props.sessionId);
    })
    .catch(res => {
      console.log(res);
    });
    this.setState({
      date: "",
      start: "",
      finish: "",
      breakLength: ""
    });
  };

  render() {
    return (
      <div>
        <br/><br/><br/><br/>
        <h2><b><b>ADNAT</b></b></h2>
      	<h4>Logged in as {this.props.userAttributes.name.toString()}</h4>
        <br/><br/>
        <Card>
        <CardHeader>
        <h2>Shifts</h2>
        </CardHeader>
        <CardBody>
        <table className="table table-striped" style={{ marginTop: 20 }} >
          <thead>
            <tr>
              <th>Shift ID</th>
              <th>Employee Name</th>
              <th>Shift date</th>
              <th>Start time</th>
              <th>Finish time</th>
              <th>Break length (mins)</th>
              <th>Hours worked</th>
              <th>Shift cost</th>
            </tr>
          </thead>
          <tbody>
            {this.displayTableBody()}
            <tr>
              <td />
              <td>{this.props.userAttributes.name}</td>
              <td>
                <Input
                  value={this.state.date}
                  type="text"
                  name="date"
                  onChange={this.onChangeDate}
                  required={true}
                />
              </td>
              <td>
                <Input
                  value={this.state.start}
                  type="text"
                  name="start"
                  onChange={this.onChangeStart}
                  required={true}
                />
              </td>
              <td>
                <Input
                  value={this.state.finish}
                  type="text"
                  name="finish"
                  onChange={this.onChangeFinish}
                  required={true}
                />
              </td>
              <td>
                <Input
                  value={this.state.breakLength}
                  type="number"
                  name="breakLength"
                  onChange={this.onChangeBreakLength}
                />
              </td>
              <td colSpan="2">
                <Button
                  type="submit"
                  color="primary"
                  onClick={this.onSubmit}
                >
                Create Shift
                </Button>
              </td>
            </tr>
          </tbody>
        </table>
        <br />
        <br />
        <center>
          <Button color="secondary" onClick={this.props.toggleShift}>Back</Button>
        </center>
        </CardBody>
        </Card>
      </div>
    );
  }
}

export default Shifts;
