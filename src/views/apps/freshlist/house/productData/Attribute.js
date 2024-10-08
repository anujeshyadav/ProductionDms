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
import { EditorState, convertToRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "../../../../../assets/scss/plugins/extensions/editor.scss";
import draftToHtml from "draftjs-to-html";
import { Route } from "react-router-dom";

import { history } from "../../../../../history";
import axiosConfig from "../../../../../axiosConfig";

export class Attribute extends Component {
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

  changeHandler = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };
  handleremove = (index) => {
    const list = [...this.state.inputlist];
    list.splice(index, 1);
    this.setState({ inputlist: list });
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
              <Row className="mb-2">
                {/* <Col lg="2" md="2" className="mb-2">
                  <Label>Size</Label>
                  <CustomInput
                    type="select"
                    placeholder="Size"
                    name="type"
                    value={this.state.size}
                    onChange={this.changeHandler}
                  >
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </CustomInput>
                </Col> */}
                <Col lg="12" md="12" className="mb-2">
                  <Label>Required</Label>
                  <CustomInput
                    type="select"
                    placeholder="Required"
                    name="type"
                    value={this.state.required}
                    onChange={this.changeHandler}
                  >
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </CustomInput>
                </Col>
                <hr />
              </Row>
              <Row>
                <Col lg="12" md="12">
                  <Table responsive bordered>
                    <thead>
                      <tr>
                        <th>Option Value</th>
                        <th>Quantity</th>
                        <th>Subtract Stock</th>
                        <th>Price</th>
                        <th> Special Price</th>
                        <th>Points</th>
                        <th>Weight</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.inputlist.map((e, i) => {
                        return (
                          <>
                            <tr key={i}>
                              <td className="p-0">
                                <CustomInput
                                  type="select"
                                  placeholder="option value"
                                  name="type"
                                  value={this.state.name}
                                  onChange={this.changeHandler}
                                >
                                  <option value="Yes">Large</option>
                                  <option value="No">Small</option>
                                </CustomInput>
                              </td>
                              <td>
                                <Input
                                  type="text"
                                  placeholder="Quantity"
                                  name="name"
                                  value={this.state.name}
                                  onChange={this.changeHandler}
                                />
                              </td>
                              <td>
                                <CustomInput
                                  type="select"
                                  placeholder="option value"
                                  name="type"
                                  value={this.state.name}
                                  onChange={this.changeHandler}
                                >
                                  <option value="Yes">+</option>
                                  <option value="No">-</option>
                                </CustomInput>
                              </td>
                              <td>
                                <CustomInput
                                  type="select"
                                  placeholder="option value"
                                  name="type"
                                  value={this.state.name}
                                  onChange={this.changeHandler}
                                >
                                  <option value="Yes">+</option>
                                  <option value="No">-</option>
                                </CustomInput>
                                <Input
                                  type="text"
                                  placeholder="Quantity"
                                  name="quantity"
                                  value={this.state.quantity}
                                  onChange={this.changeHandler}
                                />
                              </td>
                              <td>
                                <CustomInput
                                  type="select"
                                  placeholder="option value"
                                  name="type"
                                  value={this.state.name}
                                  onChange={this.changeHandler}
                                >
                                  <option value="Yes">+</option>
                                  <option value="No">-</option>
                                </CustomInput>
                                <Input
                                  type="text"
                                  placeholder="Quantity"
                                  name="name"
                                  value={this.state.name}
                                  onChange={this.changeHandler}
                                />
                              </td>
                              <td>
                                <CustomInput
                                  type="select"
                                  placeholder="option value"
                                  name="type"
                                  value={this.state.name}
                                  onChange={this.changeHandler}
                                >
                                  <option value="Yes">+</option>
                                  <option value="No">-</option>
                                </CustomInput>
                                <Input
                                  type="text"
                                  placeholder="Quantity"
                                  name="name"
                                  value={this.state.name}
                                  onChange={this.changeHandler}
                                />
                              </td>
                              <td>
                                <CustomInput
                                  type="select"
                                  placeholder="option value"
                                  name="type"
                                  value={this.state.name}
                                  onChange={this.changeHandler}
                                >
                                  <option value="Yes">+</option>
                                  <option value="No">-</option>
                                </CustomInput>
                                <Input
                                  type="text"
                                  placeholder="Quantity"
                                  name="name"
                                  value={this.state.name}
                                  onChange={this.changeHandler}
                                />
                              </td>
                              <td>
                                {this.state.inputlist.length !== 1 && (
                                  <Button
                                    color="primary"
                                    className="mr-1 mt-2"
                                    style={{ height: "40px" }}
                                    onClick={() => this.handleremove(i)}
                                  >
                                    -
                                  </Button>
                                )}
                              </td>
                            </tr>
                            <tr>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td>
                                {this.state.inputlist.length - 1 === i && (
                                  <Button
                                    color="primary"
                                    style={{ padding: "5px 8px" }}
                                    onClick={this.handleClick}
                                  >
                                    +
                                  </Button>
                                )}
                              </td>
                              <td></td>
                            </tr>
                          </>
                        );
                      })}
                    </tbody>
                  </Table>
                </Col>
              </Row>
            </Form>
          </CardBody>
        </Card>
      </div>
    );
  }
}
export default Attribute;
