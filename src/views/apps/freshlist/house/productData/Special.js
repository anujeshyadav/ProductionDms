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

export class Special extends Component {
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
  //   handleremove = (index) => {
  //     const list = [...this.state.inputlist];
  //     list.splice(index, 1);
  //     this.setState({ inputlist: list });
  //   };

  //   handleinputchange = (e, index) => {
  //     const { name, value } = e.target;
  //     const list = [...this.state.inputlist];
  //     list[index][name] = value;
  //     this.setState({ inputlist: list });

  //     console.log(this.state.inputlist);
  //   };
  //   handleClick = () => {
  //     this.setState({
  //       inputlist: [
  //         ...this.state.inputlist,
  //         { selected: this.state.myvalue, attribute: "", quantity: "" },
  //       ],
  //     });
  //   };

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
              <hr />
              <Row>
                <Col lg="12" md="12">
                  <Table responsive bordered>
                    <thead>
                      <tr>
                        <th>Customer Group</th>
                        <th>Priority</th>
                        <th>Price</th>
                        <th>Date Start</th>
                        <th>Date End</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
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
                          <Button
                            className=" btn btn-danger"
                            style={{ padding: "5px 8px" }}
                            // onClick={() =>
                            //   history.push("/app/freshlist/house/houseProductList")
                            // }
                          >
                            -
                          </Button>
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
                          <Button
                            className=" btn btn-primary"
                            color="blue"
                            style={{ padding: "5px 8px" }}
                          >
                            +
                          </Button>
                        </td>
                        <td></td>
                      </tr>
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
export default Special;
