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
  Table,
} from "reactstrap";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "../../../../../assets/scss/plugins/extensions/editor.scss";
import { Route } from "react-router-dom";
import { history } from "../../../../../history";
import axiosConfig from "../../../../../axiosConfig";

import { Tabs, Tab } from "react-bootstrap-tabs";
import { Container } from "reactstrap";
import { Variant } from "./Products/Variant";
export class Products extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      selectedFile: null,
      selectedName: "",
      sortorder: "",
      desc: "",
      brand_img: "",
      quantity: "",
      size: "",
      required: "",
      quant: "",
      optValue: "",
      opValue: "",
      status: "",
      inputlist: [{ selected: "", attribute: "", quantity: "" }],
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
  handleremove = (index) => {
    const list = [...this.state.inputlist];
    list.splice(index, 1);
    this.setState({ inputlist: list });
  };

  handleinputchange = (e, index) => {
    const { name, value } = e.target;
    const list = [...this.state.inputlist];
    list[index][name] = value;
    this.setState({ inputlist: list });

    console.log(this.state.inputlist);
  };
  handleClick = () => {
    this.setState({
      inputlist: [
        ...this.state.inputlist,
        { selected: this.state.myvalue, attribute: "", quantity: "" },
      ],
    });
  };

  submitHandler = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", this.state.name);
    data.append("sortorder", this.state.sortorder);
    data.append("quantity", this.state.quantity);
    data.append("size", this.state.size);
    data.append("required", this.state.required);
    data.append("desc", this.state.desc);
    data.append("quant", this.state.quant);
    data.append("optValue", this.state.optValue);
    data.append("opValue", this.state.opValue);
    data.append("status", this.state.status);
    data.append("productName", this.state.productName);
    data.append("quant", this.state.quant);
    if (this.state.selectedFile !== null) {
      data.append(
        "brand_img",
        this.state.selectedFile,
        this.state.selectedName
      );
    }
  };
  render() {
    return (
      <div>
        <Card>
          <CardBody>
            <Form className="m-1" onSubmit={this.submitHandler}>
              <Row>
                <Col lg="12" md="12">
                  <Table bordered>
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Model</th>
                        <th>Quantity</th>
                        <th>Unit Price</th>
                        <th>Total</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.inputlist.map((e, i) => {
                        return (
                          <>
                            <tr key={i}>
                              <td className="p-0">
                                Vim Bar Tum Scruber-weght 250g
                              </td>
                              <td>Detergent</td>
                              <td>
                                <Input
                                  type="text"
                                  placeholder="Quantity"
                                  name="name"
                                  value="1"
                                  onChange={this.changeHandler}
                                />
                              </td>
                              <td>Rs 26.00</td>
                              <td>Rs 26.00</td>
                              <td>
                                {this.state.inputlist.length !== 0 && (
                                  <Button
                                    color="danger"
                                    className="mr-1 mt-2"
                                    style={{ height: "40px" }}
                                    onClick={() => this.handleremove(i)}
                                  >
                                    -
                                  </Button>
                                )}
                              </td>
                            </tr>
                          </>
                        );
                      })}
                    </tbody>
                  </Table>
                </Col>
              </Row>
            </Form>
            <div>
              <Container>
                <Tabs
                  onSelect={(index, label) => console.log(label + " selected")}
                >
                  <Tab label="Product">
                    <div>
                      <Card>
                        <div style={{ color: "#000000" }}>Add Products(s)</div>
                        <CardBody>
                          <Form className="m-1" onSubmit={this.submitHandler}>
                            <Row className="mb-2">
                              <Col lg="12" md="12" className="mb-2">
                                <Label>Choose Product</Label>
                                <CustomInput
                                  type="select"
                                  placeholder="Select Type"
                                  name="type"
                                  value={this.state.productlist}
                                  onChange={this.changeHandler}
                                >
                                  <option value="tomato">tomato</option>
                                  <option value="onion">onion</option>
                                  <option value="apple">apple</option>
                                </CustomInput>
                              </Col>
                              <Col lg="12" md="12" className="mb-2">
                                <Label>Quantity</Label>
                                <Input
                                  type="text"
                                  placeholder="Quantity"
                                  name="quant"
                                  value={this.state.quant}
                                  onChange={this.changeHandler}
                                />
                              </Col>
                              <hr />
                            </Row>
                            <Row>
                              <div
                                style={{ textAlign: "right", width: "100%" }}
                              >
                                <Button
                                  color="primary"
                                  className="mr-1 mb-1"
                                  onClick={this.handleClick}
                                >
                                  Add Product
                                </Button>
                              </div>
                            </Row>
                            <Row>
                              <Col className="rrr">
                                <Button
                                  color="secondary"
                                  type="submit"
                                  className="mr-1 mb-1"
                                >
                                  Back
                                </Button>
                                <Button
                                  color="primary"
                                  type="submit"
                                  className="mr-1 mb-1 "
                                >
                                  Continue
                                </Button>
                              </Col>
                            </Row>
                          </Form>
                        </CardBody>
                      </Card>
                    </div>
                  </Tab>
                  <Tab label="Variant">
                    <Variant />
                  </Tab>
                </Tabs>
                <hr />
              </Container>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }
}
export default Products;
