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
import { EditorState, convertToRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
// import "../../../../assets/scss/plugins/extensions/editor.scss";
import "../../../../../assets/scss/plugins/extensions/editor.scss";
import draftToHtml from "draftjs-to-html";
import { Route } from "react-router-dom";
// -------------------------

import { history } from "../../../../../history";
import axiosConfig from "../../../../../axiosConfig";

export class Data extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      selectedFile: null,
      selectedName: "",
      sortorder: "",
      desc: "",
      brand_img: "",
      status: "",
    };
  }

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
    axiosConfig
      .post("/addbrand", data)
      .then((response) => {
        console.log(response);
        this.props.history.push("/app/freshlist/house/HouseProductList");
      })
      .catch((error) => {
        console.log(error);
      });
  };
  render() {
    return (
      <div>
        <Card>
          {/* <Row className="m-2">
            <Col>
              <h1 col-sm-6 className="float-left">
                Data
              </h1>
            </Col>
          </Row> */}
          <CardBody>
            <Form className="m-1" onSubmit={this.submitHandler}>
              <Row className="mb-2">
                <Col lg="12" md="12" className="mb-2">
                  <Label> Model</Label>
                  <Input
                    type="text"
                    placeholder="Model"
                    name="name"
                    value={this.state.name}
                    onChange={this.changeHandler}
                  />
                </Col>
                <hr />
                <Col lg="12" md="12" className="mb-2">
                  <Label> SKU</Label>
                  <Input
                    type="text"
                    placeholder="SKU"
                    name="name"
                    value={this.state.name}
                    onChange={this.changeHandler}
                  />
                </Col>
                <hr />

                <Col lg="12" md="12" className="mb-2">
                  <Label>Price</Label>
                  <Input
                    type="number"
                    placeholder="Price"
                    name="name"
                    value={this.state.name}
                    onChange={this.changeHandler}
                  />
                </Col>
                <hr />
                <Col lg="12" md="12" className="mb-2">
                  <Label>Tax Class</Label>
                  <CustomInput
                    type="select"
                    placeholder="Select Type"
                    name="type"
                    value={this.state.name}
                    onChange={this.changeHandler}
                  >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                  </CustomInput>
                </Col>
                <hr />
                <Col lg="12" md="12" className="mb-2">
                  <Label>Quantity</Label>
                  <Input
                    type="number"
                    placeholder="Quantity"
                    name="name"
                    value={this.state.name}
                    onChange={this.changeHandler}
                  />
                </Col>
                <hr />
                <Col lg="12" md="12" className="mb-2">
                  <Label>Minimum Quantity</Label>
                  <Input
                    type="number"
                    placeholder="Minimum Quantity"
                    name="name"
                    value={this.state.name}
                    onChange={this.changeHandler}
                  />
                </Col>
                <hr />
                <Col lg="12" md="12" className="mb-2">
                  <Label>Maximum Quantity</Label>
                  <Input
                    type="number"
                    placeholder="Maximum Quantity"
                    name="name"
                    value={this.state.name}
                    onChange={this.changeHandler}
                  />
                </Col>
                <hr />
                <Col lg="12" md="12" className="mb-2">
                  <Label>Preorder Limit</Label>
                  <Input
                    type="number"
                    placeholder="Preorder Limit"
                    name="name"
                    value={this.state.name}
                    onChange={this.changeHandler}
                  />
                </Col>
                <hr />
                <Col lg="12" md="12" className="mb-2">
                  <Label>Subtract Stock</Label>
                  <CustomInput
                    type="select"
                    placeholder="Select Type"
                    name="type"
                    value={this.state.name}
                    onChange={this.changeHandler}
                  >
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </CustomInput>
                </Col>
                <hr />
                <Col lg="12" md="12" className="mb-2">
                  <Label>Out Of Stock Status</Label>
                  <CustomInput
                    type="select"
                    placeholder="Select Type"
                    name="type"
                    value={this.state.name}
                    onChange={this.changeHandler}
                  >
                    <option value="Yes">Notify Me</option>
                    <option value="No">No</option>
                  </CustomInput>
                </Col>
                <hr />
                <Col lg="12" md="12" className="mb-2">
                  <Label>Status</Label>
                  <CustomInput
                    type="select"
                    placeholder="Select Type"
                    name="type"
                    value={this.state.name}
                    onChange={this.changeHandler}
                  >
                    <option value="Kilogram">Enabled</option>
                    <option value="Gram">Disabled</option>
                  </CustomInput>
                </Col>
                <hr />
                <Col lg="12" md="12" className="mb-2">
                  <Label>Sort Order</Label>
                  <Input
                    type="number"
                    placeholder="Sort Order"
                    name="name"
                    value="29"
                    onChange={this.changeHandler}
                  />
                </Col>
                <hr />
              </Row>
            </Form>
          </CardBody>
        </Card>
      </div>
    );
  }
}
export default Data;
