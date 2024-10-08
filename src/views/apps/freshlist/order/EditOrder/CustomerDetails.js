import React, { Component } from "react";
import {
  Card,
  CardBody,
  Col,
  Form,
  Row,
  Input,
  Label,
  Button,
  FormGroup,
  CustomInput,
} from "reactstrap";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "../../../../../assets/scss/plugins/extensions/editor.scss";
import draftToHtml from "draftjs-to-html";
import { Route } from "react-router-dom";
import { history } from "../../../../../history";
import axiosConfig from "../../../../../axiosConfig";

export class CustomerDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      telephone: "",
      customer: "",
      customergroup: "",
      name: "",
      firstname: "",
      lastname: "",
      email: "",
      selectedFile: null,
      selectedName: "",
      sortorder: "",
      desc: "",
      brand_img: "",
      status: "",
    };
  }

  onChangeHandler = event => {
    this.setState({ selectedFile: event.target.files[0] });
    this.setState({ selectedName: event.target.files[0].name });
    console.log(event.target.files[0]);
  };

  changeHandler1 = e => {
    this.setState({ status: e.target.value });
  };
  changeHandler = e => {
    this.setState({ [e.target.name]: e.target.value });
  };
  submitHandler = e => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", this.state.name);
    data.append("sortorder", this.state.sortorder);
    data.append("desc", this.state.desc);
    data.append("status", this.state.status);
    if (this.state.selectedFile !== null) {
      data.append(
        "brand_img",
        this.state.selectedFile,
        this.state.selectedName
      );
    }
    //   for (var value of data.values()) {
    //     console.log(value);
    //  }
    // axiosConfig
    //   .post("/addbrand", data)
    //   .then((response) => {
    //     console.log(response);
    //     this.props.history.push("/app/freshlist/house/HouseProductList");
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
  };
  render() {
    return (
      <div>
        <Card>
          <CardBody>
            <Form className="m-1" onSubmit={this.submitHandler}>
              <Row className="mb-2">
                <Col lg="12" md="12" className="mb-2">
                  <Label>Telephone</Label>
                  <Input
                    type="number"
                    placeholder="Telephone"
                    name="telephone"
                    value={this.state.telephone}
                    onChange={this.changeHandler}
                  />
                </Col>
                <hr />
                <Col lg="12" md="12" className="mb-2">
                  <Label>Customer</Label>
                  <Input
                    type="text"
                    placeholder="Customer"
                    name="customer"
                    value={this.state.customer}
                    onChange={this.changeHandler}
                  />
                </Col>
                <hr />
                <Col lg="12" md="12" className="mb-2">
                  <Label>Customer Group</Label>
                  <CustomInput
                    type="select"
                    placeholder="Select Type"
                    name="customergroup"
                    value={this.state.customergroup}
                    onChange={this.changeHandler}
                  >
                    <option value="default">Default</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                  </CustomInput>
                </Col>
                <Col lg="12" md="12" className="mb-2">
                  <Label>FirstName</Label>
                  <Input
                    type="text"
                    placeholder="FirstName"
                    name="firstname"
                    value={this.state.firstname}
                    onChange={this.changeHandler}
                  />
                </Col>
                <hr />
                <Col lg="12" md="12" className="mb-2">
                  <Label>LastName</Label>
                  <Input
                    type="text"
                    placeholder="LastName"
                    name="lastname"
                    value={this.state.lastname}
                    onChange={this.changeHandler}
                  />
                </Col>
                <hr />
                <Col lg="12" md="12" className="mb-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    placeholder="Email"
                    name="email"
                    value={this.state.email}
                    onChange={this.changeHandler}
                  />
                </Col>
                <hr />
              </Row>
              <Row>
                <Button.Ripple
                  color="primary"
                  type="submit"
                  className="mr-1 mb-1 right"
                >
                  Continue
                </Button.Ripple>
              </Row>
            </Form>
          </CardBody>
        </Card>
      </div>
    );
  }
}
export default CustomerDetails;
