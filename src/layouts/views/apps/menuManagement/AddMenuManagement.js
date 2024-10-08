import React, { Component } from "react";
import {
  Col,
  Row,
  Card,
  CardBody,
  Form,
  CustomInput,
  Label,
  Input,
  Button,
} from "reactstrap";
import axios from "axios";
import { history } from "../../../history";

export default class AddUsers extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userID: "",
      usertype: "",
      username: "",
      password: "",
      pincode: "",
      phone_no: "",
      mobile_no: "",
      email: "",
      website: "",  
      country: "",
      state: "",
      city: "",
      userImage: "",
      status: "",
      selectedName: "",
      selectedFile: null,
      // udhyog_adhar_no: "",
      // licence_no: "",
      // technician_assot_no: "",
      // gov_licence_no: "",
      // eb_license: "",
      // aadhar_no: "",
      // pancard_no: "",
      // bank_name: "",
      // bank_user_name: "",
      // bank_account_no: "",
      // ifsc_code: "",
      // date_of_birth: "",
      // marriage_anniversary: "",
      // gstin_no: "",
    };
  }

  //Image Submit Handler
  onChangeHandler = (event) => {
    this.setState({ selectedFile: event.target.files[0] });
    this.setState({ selectedName: event.target.files[0].name });
    console.log(event.target.files[0]);
  };
  changeHandler1 = (e) => {
    this.setState({ status: e.target.value });
  };
  changeHandler = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };
  submitHandler = (e) => {
    e.preventDefault();
    console.log(this.state);

    const data = new FormData();
    data.append("userID", this.state.userID);
    data.append("usertype", this.state.usertype);
    data.append("username", this.state.username);
    data.append("password", this.state.password);
    data.append("pincode", this.state.pincode);
    data.append("phone_no", this.state.phone_no);
    data.append("mobile_no", this.state.mobile_no);
    data.append("email", this.state.email);
    data.append("website", this.state.website);
    // data.append("date_of_birth", this.state.date_of_birth);
    // data.append("marriage_anniversary", this.state.marriage_anniversary);
    // data.append("gstin_no", this.state.gstin_no);
    data.append("country", this.state.country);
    data.append("state", this.state.state);
    data.append("city", this.state.city);
    // data.append("udhyog_adhar_no", this.state.udhyog_adhar_no);
    // data.append("licence_no", this.state.licence_no);
    // data.append("technician_assot_no", this.state.technician_assot_no);
    // data.append("gov_licence_no", this.state.gov_licence_no);
    // data.append("eb_license", this.state.eb_license);
    // data.append("aadhar_no", this.state.aadhar_no);
    // data.append("pancard_no", this.state.pancard_no);
    // data.append("bank_name", this.state.bank_name);
    // data.append("bank_user_name", this.state.bank_user_name);
    // data.append("bank_account_no", this.state.bank_account_no);
    // data.append("ifsc_code", this.state.ifsc_code);
    data.append("status", this.state.status);
    data.append("userImage", this.state.selectedFile, this.state.selectedName);

    for (var value of data.values()) {
      console.log(value);
    }

    for (var key of data.keys()) {
      console.log(key);
    }
    axios
      .post("http://65.2.150.118:4444/api/user/adduserbyadmin", data)
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  render() {
    return (
      <div>
        <Card>
          <Row className="m-2">
            <Col>
              <h1 col-sm-6 className="float-left">
               Add Menu
              </h1>
            </Col>
            <Col>
              <Button
                className=" btn btn-danger float-right"
                onClick={() => history.push("/app/menuManagement/menuManagementList")}
              >
                Back
              </Button>
            </Col>
          </Row>
          <CardBody>
            <Form className="m-1" onSubmit={this.submitHandler}>
              <Row>
         
                <Col lg="6" md="6" sm="6" className="mb-2">
                  <Label>Menu Name:</Label>
                  <Input
                    required
                    type="text"
                    placeholder="User Name"
                    name="username"
                    value={this.state.userID}
                    onChange={this.changeHandler}
                  />
                </Col>
              
                <Col lg="6" md="6" sm="6" className="mb-2">
                  <Label>Menu Icon:</Label>
                  <Input
                    required
                    type="text"
                    placeholder="User Name"
                    name="username"
                    value={this.state.userID}
                    onChange={this.changeHandler}
                  />
                </Col>
               
                <Col lg="6" md="6" sm="6" className="mb-2">
                  <Label>Select Categories:</Label>
                  <Input
                    required
                    type="text"
                    placeholder="User Name"
                    name="username"
                    value={this.state.userID}
                    onChange={this.changeHandler}
                  />
                </Col>
                <Col lg="6" md="6" sm="6" className="mb-2">
                  <Label>User Image</Label>
                  <Input required type="file" onChange={this.onChangeHandler} />
                </Col>

                <Col lg="6" md="6" sm="6" className="mb-2">
                  <Label className="mb-1">Status</Label>
                  <div
                    className="form-label-group"
                    onChange={(e) => this.changeHandler1(e)}
                  >
                    <input
                      style={{ marginRight: "3px" }}
                      type="checkbox"
                      name="status"
                      value="Active"
                    />
                    <span style={{ marginRight: "20px" }}>Active</span>

                    <input
                      style={{ marginRight: "3px" }}
                      type="radio"
                      name="status"
                      value="Inactive"
                    />
                    <span style={{ marginRight: "3px" }}>Inactive</span>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col lg="6" md="6" sm="6" className="mb-2">
                  <Button.Ripple
                    color="primary"
                    type="submit"
                    className="mr-1 mb-1"
                  >
                    Add User
                  </Button.Ripple>
                </Col>
              </Row>
            </Form>
          </CardBody>
        </Card>
      </div>
    );
  }
}
