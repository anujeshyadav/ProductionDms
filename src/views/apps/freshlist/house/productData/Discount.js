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

export class Discount extends Component {
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

  //   handleinputchange = (e, index) => {
  //     const { name, value } = e.target;
  //     const list = [...this.state.inputlist];
  //     list[index][name] = value;
  //     this.setState({ inputlist: list });

  //     console.log(this.state.inputlist);
  //   };
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
    data.append("desc", this.state.desc);
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
              <hr />
              <Row>
                <Col lg="12" md="12">
                  <Table responsive bordered>
                    <thead>
                      <tr>
                        <th>Customer Group</th>
                        <th>Quantity</th>
                        <th>Priority</th>
                        <th>Price</th>
                        <th>Date Start</th>
                        <th>Date End</th>
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
                                  <option value="Default">Default</option>
                                  <option value="Large">Large</option>
                                  <option value="Small">Small</option>
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
                                <Input
                                  type="text"
                                  placeholder="Priority"
                                  name="name"
                                  value={this.state.name}
                                  onChange={this.changeHandler}
                                />
                              </td>
                              <td>
                                <Input
                                  type="text"
                                  placeholder="Price"
                                  name="name"
                                  value={this.state.name}
                                  onChange={this.changeHandler}
                                />
                              </td>
                              <td>
                                <Input
                                  type="date"
                                  placeholder="Date Start"
                                  name="name"
                                  value={this.state.name}
                                  onChange={this.changeHandler}
                                />
                              </td>
                              <td>
                                <Input
                                  type="date"
                                  placeholder="Date End"
                                  name="name"
                                  value={this.state.name}
                                  onChange={this.changeHandler}
                                />
                              </td>
                              <td>
                                {this.state.inputlist.length !== 1 && (
                                  <Button
                                    color="primary"
                                    className="mr-1"
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
                      {this.state.inputlist.map((e, i) => {
                        return (
                          <>
                            <tr key={i}>
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
export default Discount;
