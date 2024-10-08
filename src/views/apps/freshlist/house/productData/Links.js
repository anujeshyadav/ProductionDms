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
import "../../../../../assets/scss/plugins/extensions/editor.scss";
import draftToHtml from "draftjs-to-html";
import { Route } from "react-router-dom";

import { history } from "../../../../../history";
import axiosConfig from "../../../../../axiosConfig";

export class Links extends Component {
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
          <CardBody>
            <Form className="m-1" onSubmit={this.submitHandler}>
              <Row className="mb-2">
                <Col lg="12" md="12" className="mb-2">
                  <Label> Manufactures</Label>
                  <Input
                    type="text"
                    placeholder="Manufactures"
                    name="name"
                    value="Britannia"
                    onChange={this.changeHandler}
                  />
                </Col>
                <hr />
                <Col lg="12" md="12" className="mb-2">
                  <Label>Category</Label>
                  <CustomInput
                    type="select"
                    placeholder="Category"
                    name="type"
                    value={this.state.name}
                    onChange={this.changeHandler}
                  >
                    <option>Category</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                  </CustomInput>
                </Col>
                <hr />
                {/* <Col lg="12" md="12" className="mb-2">
                  <Label>Filter</Label>
                  <CustomInput
                    type="select"
                    placeholder="Filter"
                    name="type"
                    value={this.state.name}
                    onChange={this.changeHandler}
                  >
                    <option>Filter</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                  </CustomInput>
                </Col>
                <hr /> */}
                <Col lg="12" md="12" className="mb-2">
                  <Label>Related Products</Label>
                  <CustomInput
                    type="select"
                    placeholder="Related Products"
                    name="type"
                    value={this.state.name}
                    onChange={this.changeHandler}
                  >
                    <option>Related Products</option>
                    <option value="1">Bottle Gourd</option>
                    <option value="2">Fennel/Saunf -Big </option>
                    <option value="3">Kelloggs Oats Raw 450g</option>
                    <option value="3">Weikfield Custard Powder Mango</option>
                  </CustomInput>
                </Col>
                <hr />
                <Col lg="6" md="6" className="mb-1">
                  <FormGroup tag="fieldset" className="d-flex ">
                    <Label>
                      Show Bundle always(Bundle pop up will be shown
                      irrespective of cart count):
                    </Label>
                    <div className="d-flex ml-1">
                      <FormGroup check>
                        <Input
                          value="bundleyes"
                          name="radio1"
                          type="radio"
                          checked
                        />

                        <Label check className="mr-2">
                          Yes
                        </Label>
                      </FormGroup>
                      <FormGroup check>
                        <Input value="bundleNO" name="radio1" type="radio" />
                        <Label check>No</Label>
                      </FormGroup>
                    </div>
                  </FormGroup>
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
export default Links;
